# response.in_progress

Emitted when the response is in progress.

## Properties

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `type` | string | Yes |  | `response.in_progress` | The type of the event. Always `response.in_progress`.
 |
| `response` | object (24 properties) | Yes |  |  | The response that is in progress.
 |
format, and querying for objects via API or the dashboard. 

Keys are strings with a maximum length of 64 characters. Values are strings
with a maximum length of 512 characters.
 |
|   ↳   ↳ (additional properties) | string | - | - | - | Additional properties of this object |
|   ↳ `temperature` | number | Yes | `1` |  | What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
We generally recommend altering this or `top_p` but not both.
 |
|   ↳ `top_p` | number | Yes | `1` |  | An alternative to sampling with temperature, called nucleus sampling,
where the model considers the results of the tokens with top_p probability
mass. So 0.1 means only the tokens comprising the top 10% probability mass
are considered.

We generally recommend altering this or `temperature` but not both.
 |
|   ↳ `user` | string | No |  |  | A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices#end-user-ids).
 |
|   ↳ `service_tier` | string | No | `auto` | `auto`, `default`, `flex` | Specifies the latency tier to use for processing the request. This parameter is relevant for customers subscribed to the scale tier service:
  - If set to 'auto', and the Project is Scale tier enabled, the system
    will utilize scale tier credits until they are exhausted.
  - If set to 'auto', and the Project is not Scale tier enabled, the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee.
  - If set to 'default', the request will be processed using the default service tier with a lower uptime SLA and no latency guarentee.
  - If set to 'flex', the request will be processed with the Flex Processing service tier. [Learn more](/docs/guides/flex-processing).
  - When not set, the default behavior is 'auto'.

  When this parameter is set, the response body will include the `service_tier` utilized.
 |
|   ↳ `previous_response_id` | string | No |  |  | The unique ID of the previous response to the model. Use this to
create multi-turn conversations. Learn more about 
[conversation state](/docs/guides/conversation-state).
 |
|   ↳ `model` | anyOf: anyOf: string | string | string | Yes |  |  | Model ID used to generate the response, like `gpt-4o` or `o3`. OpenAI
offers a wide range of models with different capabilities, performance
characteristics, and price points. Refer to the [model guide](/docs/models)
to browse and compare available models.
 |
|   ↳ `reasoning` | object (3 properties) | No |  |  | **o-series models only**

Configuration options for 
[reasoning models](https://platform.openai.com/docs/guides/reasoning).
 |
Constrains effort on reasoning for 
[reasoning models](https://platform.openai.com/docs/guides/reasoning).
Currently supported values are `low`, `medium`, and `high`. Reducing
reasoning effort can result in faster responses and fewer tokens used
on reasoning in a response.
 |
|     ↳ `summary` | string | No |  | `auto`, `concise`, `detailed` | A summary of the reasoning performed by the model. This can be
useful for debugging and understanding the model's reasoning process.
One of `auto`, `concise`, or `detailed`.
 |
|     ↳ `generate_summary` | string | No |  | `auto`, `concise`, `detailed` | **Deprecated:** use `summary` instead.

A summary of the reasoning performed by the model. This can be
useful for debugging and understanding the model's reasoning process.
One of `auto`, `concise`, or `detailed`.
 |
|   ↳ `max_output_tokens` | integer | No |  |  | An upper bound for the number of tokens that can be generated for a response, including visible output tokens and [reasoning tokens](/docs/guides/reasoning).
 |
|   ↳ `instructions` | string | Yes |  |  | Inserts a system (or developer) message as the first item in the model's context.

When using along with `previous_response_id`, the instructions from a previous
response will not be carried over to the next response. This makes it simple
to swap out system (or developer) messages in new responses.
 |
|   ↳ `text` | object (1 property) | No |  |  | Configuration options for a text response from the model. Can be plain
text or structured JSON data. Learn more:
- [Text inputs and outputs](/docs/guides/text)
- [Structured Outputs](/docs/guides/structured-outputs)
 |
Configuring `{ "type": "json_schema" }` enables Structured Outputs, 
which ensures the model will match your supplied JSON schema. Learn more in the 
[Structured Outputs guide](/docs/guides/structured-outputs).

The default format is `{ "type": "text" }` with no additional options.

**Not recommended for gpt-4o and newer models:**

Setting to `{ "type": "json_object" }` enables the older JSON mode, which
ensures the message the model generates is valid JSON. Using `json_schema`
is preferred for models that support it.
 |
|   ↳ `tools` | array of oneOf: object (5 properties) | object (5 properties) | object (3 properties) | object (4 properties) | Yes |  |  | An array of tools the model may call while generating a response. You 
can specify which tool to use by setting the `tool_choice` parameter.

The two categories of tools you can provide the model are:

- **Built-in tools**: Tools that are provided by OpenAI that extend the
  model's capabilities, like [web search](/docs/guides/tools-web-search)
  or [file search](/docs/guides/tools-file-search). Learn more about
  [built-in tools](/docs/guides/tools).
- **Function calls (custom tools)**: Functions that are defined by you,
  enabling the model to call your own code. Learn more about
  [function calling](/docs/guides/function-calling).
 |
|   ↳ `tool_choice` | oneOf: string | object (1 property) | object (2 properties) | Yes |  |  | How the model should select which tool (or tools) to use when generating
a response. See the `tools` parameter to see how to specify which tools
the model can call.
 |
|   ↳ `truncation` | string | No | `disabled` | `auto`, `disabled` | The truncation strategy to use for the model response.
- `auto`: If the context of this response and previous ones exceeds
  the model's context window size, the model will truncate the 
  response to fit the context window by dropping input items in the
  middle of the conversation. 
- `disabled` (default): If a model response will exceed the context window 
  size for a model, the request will fail with a 400 error.
 |
|   ↳ `id` | string | Yes |  |  | Unique identifier for this Response.
 |
|   ↳ `object` | string | Yes |  | `response` | The object type of this resource - always set to `response`.
 |
|   ↳ `status` | string | No |  | `completed`, `failed`, `in_progress`, `incomplete` | The status of the response generation. One of `completed`, `failed`, 
`in_progress`, or `incomplete`.
 |
|   ↳ `created_at` | number | Yes |  |  | Unix timestamp (in seconds) of when this Response was created.
 |
|   ↳ `error` | object (2 properties) | Yes |  |  | An error object returned when the model fails to generate a Response.
 |
|     ↳ `message` | string | Yes |  |  | A human-readable description of the error.
 |
|   ↳ `incomplete_details` | object (1 property) | Yes |  |  | Details about why the response is incomplete.
 |
|   ↳ `output` | array of anyOf: object (5 properties) | object (5 properties) | object (6 properties) | object (3 properties) | object (6 properties) | object (5 properties) | Yes |  |  | An array of content items generated by the model.

- The length and order of items in the `output` array is dependent
  on the model's response.
- Rather than accessing the first item in the `output` array and 
  assuming it's an `assistant` message with the content generated by
  the model, you might consider using the `output_text` property where
  supported in SDKs.
 |
|   ↳ `output_text` | string | No |  |  | SDK-only convenience property that contains the aggregated text output 
from all `output_text` items in the `output` array, if any are present. 
Supported in the Python and JavaScript SDKs.
 |
|   ↳ `usage` | object (5 properties) | No |  |  | Represents token usage details including input tokens, output tokens,
a breakdown of output tokens, and the total tokens used.
 |
 |
|     ↳ `output_tokens` | integer | Yes |  |  | The number of output tokens. |
|     ↳ `output_tokens_details` | object (1 property) | Yes |  |  | A detailed breakdown of the output tokens. |
|     ↳ `total_tokens` | integer | Yes |  |  | The total number of tokens used. |
|   ↳ `parallel_tool_calls` | boolean | Yes | `true` |  | Whether to allow the model to run tool calls in parallel.
 |

## Property Details

### `type` (required)

The type of the event. Always `response.in_progress`.


**Type**: string

**Allowed values**: `response.in_progress`

### `response` (required)

The response that is in progress.


**Type**: object (24 properties)

**Nested Properties**:

* `metadata`, `temperature`, `top_p`, `user`, `service_tier`, `previous_response_id`, `model`, `reasoning`, `max_output_tokens`, `instructions`, `text`, `tools`, `tool_choice`, `truncation`, `id`, `object`, `status`, `created_at`, `error`, `incomplete_details`, `output`, `output_text`, `usage`, `parallel_tool_calls`

## Example

```json
{
  "type": "response.in_progress",
  "response": {
    "id": "resp_67ccfcdd16748190a91872c75d38539e09e4d4aac714747c",
    "object": "response",
    "created_at": 1741487325,
    "status": "in_progress",
    "error": null,
    "incomplete_details": null,
    "instructions": null,
    "max_output_tokens": null,
    "model": "gpt-4o-2024-08-06",
    "output": [],
    "parallel_tool_calls": true,
    "previous_response_id": null,
    "reasoning": {
      "effort": null,
      "summary": null
    },
    "store": true,
    "temperature": 1,
    "text": {
      "format": {
        "type": "text"
      }
    },
    "tool_choice": "auto",
    "tools": [],
    "top_p": 1,
    "truncation": "disabled",
    "usage": null,
    "user": null,
    "metadata": {}
  }
}

```

