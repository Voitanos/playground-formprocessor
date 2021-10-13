import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { add } from "./SimpleMath";

/* istanbul ignore next */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  let error: Error | undefined = undefined;
  let response: string;

  context.log('HTTP trigger function processed a request.');

  const rawOperandA = req.query.operandA || req.body?.operandA;
  const rawOperandB = req.query.operandB || req.body?.operandB;

  if (!rawOperandA || !rawOperandA){
    response = `The HTTP trigger executed successfully. APP_VERSION=${ process.env.APP_VERSION } && COMMIT_HASH=${ process.env.COMMIT_HASH }.`;
  } else {
    let operandA: number;
    let operandB: number;
    try {
      operandA = parseInt(rawOperandA as string);
    } catch { error = new Error('Unable to cast operandA as number.'); }
    try {
      operandB = parseInt(rawOperandB as string);
    } catch { error = new Error('Unable to cast operandB as number.'); }

    if (isNaN(operandA) || isNaN(operandB)) {
      error = new Error('Both operandA & operandB must be numbers.');
    }

    response = `The result of ${ operandA } + ${ operandB } = ${ await add(operandA, operandB)}`;
  }

  // respond
  context.res = (!error)
    ? { status: 200, body: response }
    : { status: 400, body: error.message };

};

export default httpTrigger;