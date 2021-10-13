import {
  AzureFunction,
  Context,
  HttpRequest
} from '@azure/functions'
import * as AppInsights from 'applicationinsights';
import { parse, ParsedQs } from 'qs';
import { v4 as guid } from 'uuid';

const EVENT_SOURCE = 'FORM_HANDLER';

/**
 * Azure Function
 *
 * @param {Context} context
 * @param {HttpRequest} req
 * @return {*}  {Promise<void>}
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  try {
    if (!req.rawBody) {
      context.res = {
        status: 400,
        body: 'Invalid form submission'
      };
      context.done();
    }

    // get the body of the payload
    const parsedData: ParsedQs = parse(req.rawBody);

    // get the form ID
    const form_id = req.params['formid'].toLowerCase();

    // trace the request
    AppInsights.defaultClient.trackTrace({
      message: 'form submission received',
      properties: {
        source: EVENT_SOURCE,
        form_id: form_id,
        requestBody: JSON.stringify(req.body)
      },
      severity: AppInsights.Contracts.SeverityLevel.Verbose
    });

    // write it to the queue
    context.bindings['outputQueueItem'] = {
      'PartitionKey': form_id,
      'RowKey': guid(),
      'FormInputs': { ...parsedData }
    };

    context.res = {
      status: 200,
      body: 'OK'
    };
    context.done();
  } catch (error) {
    // track error
    AppInsights.defaultClient.trackException({
      exception: error,
      severity: AppInsights.Contracts.SeverityLevel.Critical
    });

    // respond with error
    context.res = {
      status: 400,
      body: error.message
    };
    context.done();
  }
};

export default httpTrigger;
