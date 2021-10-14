/* istanbul ignore next */
import * as AppInsights from "applicationinsights";
// enable streamof of live metrics
AppInsights.setup().setSendLiveMetrics(true);
// auto populate all azure properties, like the cloud RoleName
AppInsights.defaultClient.setAutoPopulateAzureProperties(true);
// set the current tagged version of the function
AppInsights.defaultClient.context.tags[AppInsights.defaultClient.context.keys.applicationVersion] = process.env.APP_VERSION;
// set the app name = this function
AppInsights.defaultClient.commonProperties = { 'app.name': 'form-handler' };
// start App Insights
AppInsights.start();

import {
  AzureFunction,
  Context,
  HttpRequest
} from "@azure/functions"
import azureFunction from './function';

/**
 * Default export wrapped with Application Insights FaaS context propagation
 *
 * @export
 * @param {*} context
 * @param {*} req
 * @return {*}
 */
export default async function contextPropagatingHttpTrigger(context: Context, req: HttpRequest) {
  // start an AI Correlation Context using the provided Azure Function context
  const correlationContext = AppInsights.startOperation(context, req);

  // wrap the Function runtime with correlationContext
  return AppInsights.wrapWithCorrelationContext(async () => {
    const startTime = Date.now(); // Start trackRequest timer

    // Run the Function
    await azureFunction(context, req);

    // Track Request on completion
    AppInsights.defaultClient.trackRequest({
      name: context.req.method + " " + context.req.url,
      resultCode: context.res.status,
      success: true,
      url: req.url,
      duration: Date.now() - startTime,
      id: correlationContext.operation.parentId,
    });

    AppInsights.defaultClient.flush();
  }, correlationContext)();
};