# List Chat Completions

`GET` `/chat/completions`

List stored Chat Completions. Only Chat Completions that have been stored
with the `store` parameter set to `true` will be returned.


## Parameters

### Query Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `model` | string | No | The model used to generate the Chat Completions. |
| `metadata` | map | No | A list of metadata keys to filter the Chat Completions by. Example: <br>  <br> `metadata[key1]=value1&metadata[key2]=value2` <br>  |
| `after` | string | No | Identifier for the last chat completion from the previous pagination request. |
| `limit` | integer | No | Number of Chat Completions to retrieve. |
| `order` | string | No | Sort order for Chat Completions by timestamp. Use `asc` for ascending order or `desc` for descending order. Defaults to `asc`. |

## Responses

### 200 - A list of Chat Completions

#### Content Type: `application/json`

#### ChatCompletionList

**Type**: object (5 properties)

An object representing a list of Chat Completions.


#### Properties:

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `object` | string | Yes | `list` | `list` | The type of this object. It is always set to "list". <br>  |
| `data` | array of object (8 properties) | Yes |  |  | An array of chat completion objects. <br>  |
| `first_id` | string | Yes |  |  | The identifier of the first chat completion in the data array. |
| `last_id` | string | Yes |  |  | The identifier of the last chat completion in the data array. |
| `has_more` | boolean | Yes |  |  | Indicates whether there are more Chat Completions available. |


### Items in `data` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `id` | string | Yes |  |  | A unique identifier for the chat completion. |
| `choices` | array of object (4 properties) | Yes |  |  | A list of chat completion choices. Can be more than one if `n` is greater than 1. |
| `created` | integer | Yes |  |  | The Unix timestamp (in seconds) of when the chat completion was created. |
| `model` | string | Yes |  |  | The model used for the chat completion. |
| `service_tier` | string | No | `auto` | `auto`, `default`, `flex` | Specifies the latency tier to use for processing the request. This parameter is relevant for customers subscribed to the scale tier service: <br>   - If set to 'auto', and the Project is Scale tier enabled, the system <br>     will utilize scale tier credits until they are exhausted. <br>   - If set to 'auto', and the Project is not Scale tier enabled, the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee. <br>   - If set to 'default', the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee. <br>   - If set to 'flex', the request will be processed with the Flex Processing service tier. [Learn more](/docs/guides/flex-processing). <br>   - When not set, the default behavior is 'auto'. <br>  <br>   When this parameter is set, the response body will include the `service_tier` utilized. <br>  |
| `system_fingerprint` | string | No |  |  | This fingerprint represents the backend configuration that the model runs with. <br>  <br> Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism. <br>  |
| `object` | string | Yes |  | `chat.completion` | The object type, which is always `chat.completion`. |
| `usage` | object (5 properties) | No |  |  | Usage statistics for the completion request. |
|   ↳ `total_tokens` | integer | Yes | `0` |  | Total number of tokens used in the request (prompt + completion). |
|   ↳ `completion_tokens_details` | object (4 properties) | No |  |  | Breakdown of tokens used in a completion. |
|     ↳ `reasoning_tokens` | integer | No | `0` |  | Tokens generated by the model for reasoning. |
|     ↳ `rejected_prediction_tokens` | integer | No | `0` |  | When using Predicted Outputs, the number of tokens in the <br> prediction that did not appear in the completion. However, like <br> reasoning tokens, these tokens are still counted in the total <br> completion tokens for purposes of billing, output, and context window <br> limits. <br>  |
|   ↳ `prompt_tokens_details` | object (2 properties) | No |  |  | Breakdown of tokens used in the prompt. |


### Items in `choices` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `finish_reason` | string | Yes |  | `stop`, `length`, `tool_calls`, `content_filter`, `function_call` | The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence, <br> `length` if the maximum number of tokens specified in the request was reached, <br> `content_filter` if content was omitted due to a flag from our content filters, <br> `tool_calls` if the model called a tool, or `function_call` (deprecated) if the model called a function. <br>  |
| `index` | integer | Yes |  |  | The index of the choice in the list of choices. |
| `message` | object (7 properties) | Yes |  |  | A chat completion message generated by the model. |
|   ↳ `tool_calls` | array of object (3 properties) | No |  |  | The tool calls generated by the model, such as function calls. |
|   ↳ `annotations` | array of object (2 properties) | No |  |  | Annotations for the message, when applicable, as when using the <br> [web search tool](/docs/guides/tools-web-search?api-mode=chat). <br>  |
|   ↳ `role` | string | Yes |  | `assistant` | The role of the author of this message. |
|   ↳ `function_call` | object (2 properties) | No |  |  | Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model. |
|   ↳ `audio` | object (4 properties) | No |  |  | If the audio output modality is requested, this object contains data <br> about the audio response from the model. [Learn more](/docs/guides/audio). <br>  |
|     ↳ `data` | string | Yes |  |  | Base64 encoded audio bytes generated by the model, in the format <br> specified in the request. <br>  |
|     ↳ `transcript` | string | Yes |  |  | Transcript of the audio generated by the model. |


### Items in `tool_calls` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `id` | string | Yes |  |  | The ID of the tool call. |
| `type` | string | Yes |  | `function` | The type of the tool. Currently, only `function` is supported. |
| `function` | object (2 properties) | Yes |  |  | The function that the model called. |


### Items in `annotations` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `type` | string | Yes |  | `url_citation` | The type of the URL citation. Always `url_citation`. |
| `url_citation` | object (4 properties) | Yes |  |  | A URL citation when using web search. |
|   ↳ `url` | string | Yes |  |  | The URL of the web resource. |
|   ↳ `title` | string | Yes |  |  | The title of the web resource. |
| `logprobs` | object (2 properties) | Yes |  |  | Log probability information for the choice. |


### Items in `content` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `token` | string | Yes |  |  | The token. |
| `logprob` | number | Yes |  |  | The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely. |
| `bytes` | array of integer | Yes |  |  | A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token. |
| `top_logprobs` | array of object (3 properties) | Yes |  |  | List of the most likely tokens and their log probability, at this token position. In rare cases, there may be fewer than the number of requested `top_logprobs` returned. |


### Items in `top_logprobs` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `token` | string | Yes |  |  | The token. |
| `logprob` | number | Yes |  |  | The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely. |
| `bytes` | array of integer | Yes |  |  | A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token. |


### Items in `refusal` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `token` | string | Yes |  |  | The token. |
| `logprob` | number | Yes |  |  | The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely. |
| `bytes` | array of integer | Yes |  |  | A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token. |
| `top_logprobs` | array of object (3 properties) | Yes |  |  | List of the most likely tokens and their log probability, at this token position. In rare cases, there may be fewer than the number of requested `top_logprobs` returned. |


### Items in `top_logprobs` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `token` | string | Yes |  |  | The token. |
| `logprob` | number | Yes |  |  | The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely. |
| `bytes` | array of integer | Yes |  |  | A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token. |
**Example:**

```json
{
  "object": "list",
  "data": [
    {
      "object": "chat.completion",
      "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
      "model": "gpt-4o-2024-08-06",
      "created": 1738960610,
      "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
      "tool_choice": null,
      "usage": {
        "total_tokens": 31,
        "completion_tokens": 18,
        "prompt_tokens": 13
      },
      "seed": 4944116822809979520,
      "top_p": 1.0,
      "temperature": 1.0,
      "presence_penalty": 0.0,
      "frequency_penalty": 0.0,
      "system_fingerprint": "fp_50cad350e4",
      "input_user": null,
      "service_tier": "default",
      "tools": null,
      "metadata": {},
      "choices": [
        {
          "index": 0,
          "message": {
            "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
            "role": "assistant",
            "tool_calls": null,
            "function_call": null
          },
          "finish_reason": "stop",
          "logprobs": null
        }
      ],
      "response_format": null
    }
  ],
  "first_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "last_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "has_more": false
}

```

## Examples

### Request Examples

#### curl
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"

```

#### python
```python
from openai import OpenAI
client = OpenAI()

completions = client.chat.completions.list()
print(completions)

```

### Response Example

```json
{
  "object": "list",
  "data": [
    {
      "object": "chat.completion",
      "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
      "model": "gpt-4.1-2025-04-14",
      "created": 1738960610,
      "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
      "tool_choice": null,
      "usage": {
        "total_tokens": 31,
        "completion_tokens": 18,
        "prompt_tokens": 13
      },
      "seed": 4944116822809979520,
      "top_p": 1.0,
      "temperature": 1.0,
      "presence_penalty": 0.0,
      "frequency_penalty": 0.0,
      "system_fingerprint": "fp_50cad350e4",
      "input_user": null,
      "service_tier": "default",
      "tools": null,
      "metadata": {},
      "choices": [
        {
          "index": 0,
          "message": {
            "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
            "role": "assistant",
            "tool_calls": null,
            "function_call": null
          },
          "finish_reason": "stop",
          "logprobs": null
        }
      ],
      "response_format": null
    }
  ],
  "first_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "last_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "has_more": false
}

```

