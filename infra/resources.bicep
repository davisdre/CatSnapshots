@description('The location used for all deployed resources')
param location string = resourceGroup().location

@description('Tags that will be applied to all resources')
param tags object = {}


param catSnapshotsExists bool
@secure()
param catSnapshotsDefinition object

@description('Id of the user or app to assign application roles')
param principalId string

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location)

// Monitor application with Azure Monitor
module monitoring 'br/public:avm/ptn/azd/monitoring:0.1.0' = {
  name: 'monitoring'
  params: {
    logAnalyticsName: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: '${abbrs.insightsComponents}${resourceToken}'
    applicationInsightsDashboardName: '${abbrs.portalDashboards}${resourceToken}'
    location: location
    tags: tags
  }
}

// Container registry
module containerRegistry 'br/public:avm/res/container-registry/registry:0.1.1' = {
  name: 'registry'
  params: {
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
    location: location
    tags: tags
    publicNetworkAccess: 'Enabled'
    roleAssignments:[
      {
        principalId: catSnapshotsIdentity.outputs.principalId
        principalType: 'ServicePrincipal'
        roleDefinitionIdOrName: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
      }
    ]
  }
}

// Container apps environment
module containerAppsEnvironment 'br/public:avm/res/app/managed-environment:0.4.5' = {
  name: 'container-apps-environment'
  params: {
    logAnalyticsWorkspaceResourceId: monitoring.outputs.logAnalyticsWorkspaceResourceId
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    zoneRedundant: false
  }
}

module catSnapshotsIdentity 'br/public:avm/res/managed-identity/user-assigned-identity:0.2.1' = {
  name: 'catSnapshotsidentity'
  params: {
    name: '${abbrs.managedIdentityUserAssignedIdentities}catSnapshots-${resourceToken}'
    location: location
  }
}

module catSnapshotsFetchLatestImage './modules/fetch-container-image.bicep' = {
  name: 'catSnapshots-fetch-image'
  params: {
    exists: catSnapshotsExists
    name: 'cat-snapshots'
  }
}

var catSnapshotsAppSettingsArray = filter(array(catSnapshotsDefinition.settings), i => i.name != '')
var catSnapshotsSecrets = map(filter(catSnapshotsAppSettingsArray, i => i.?secret != null), i => {
  name: i.name
  value: i.value
  secretRef: i.?secretRef ?? take(replace(replace(toLower(i.name), '_', '-'), '.', '-'), 32)
})
var catSnapshotsEnv = map(filter(catSnapshotsAppSettingsArray, i => i.?secret == null), i => {
  name: i.name
  value: i.value
})

module catSnapshots 'br/public:avm/res/app/container-app:0.8.0' = {
  name: 'catSnapshots'
  params: {
    name: 'cat-snapshots'
    ingressTargetPort: 5000
    scaleMinReplicas: 0
    scaleMaxReplicas: 1
    secrets: {
      secureList:  union([
      ],
      map(catSnapshotsSecrets, secret => {
        name: secret.secretRef
        value: secret.value
      }))
    }
    containers: [
      {
        image: catSnapshotsFetchLatestImage.outputs.?containers[?0].?image ?? 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
        name: 'main'
        resources: {
          cpu: json('0.5')
          memory: '1.0Gi'
        }
        env: union([
          {
            name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
            value: monitoring.outputs.applicationInsightsConnectionString
          }
          {
            name: 'AZURE_CLIENT_ID'
            value: catSnapshotsIdentity.outputs.clientId
          }
          {
            name: 'PORT'
            value: '5000'
          }
        ],
        catSnapshotsEnv,
        map(catSnapshotsSecrets, secret => {
            name: secret.name
            secretRef: secret.secretRef
        }))
      }
    ]
    managedIdentities:{
      systemAssigned: false
      userAssignedResourceIds: [catSnapshotsIdentity.outputs.resourceId]
    }
    registries:[
      {
        server: containerRegistry.outputs.loginServer
        identity: catSnapshotsIdentity.outputs.resourceId
      }
    ]
    environmentResourceId: containerAppsEnvironment.outputs.resourceId
    location: location
    tags: union(tags, { 'azd-service-name': 'cat-snapshots' })
  }
}
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
output AZURE_RESOURCE_CAT_SNAPSHOTS_ID string = catSnapshots.outputs.resourceId
