# conversation.item.created

Returned when a conversation item is created. There are several scenarios that produce this event:
  - The server is generating a Response, which if successful will produce 
    either one or two Items, which will be of type `message` 
    (role `assistant`) or type `function_call`.
  - The input audio buffer has been committed, either by the client or the 
    server (in `server_vad` mode). The server will take the content of the 
    input audio buffer and add it to a new user message Item.
  - The client has sent a `conversation.item.create` event to add a new Item 
    to the Conversation.


## Properties

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `event_id` | string | Yes |  |  | The unique ID of the server event. |
| `type` | string | Yes |  | `conversation.item.created` | The event type, must be `conversation.item.created`. |
| `previous_item_id` | string | Yes |  |  | The ID of the preceding item in the Conversation context, allows the 
client to understand the order of the conversation.
 |
| `item` | object (10 properties) | Yes |  |  | The item to add to the conversation. |
generate one if not provided.
 |
|   ↳ `type` | string | No |  | `message`, `function_call`, `function_call_output` | The type of the item (`message`, `function_call`, `function_call_output`).
 |
|   ↳ `object` | string | No |  | `realtime.item` | Identifier for the API object being returned - always `realtime.item`.
 |
|   ↳ `status` | string | No |  | `completed`, `incomplete` | The status of the item (`completed`, `incomplete`). These have no effect 
on the conversation, but are accepted for consistency with the 
`conversation.item.created` event.
 |
|   ↳ `role` | string | No |  | `user`, `assistant`, `system` | The role of the message sender (`user`, `assistant`, `system`), only 
applicable for `message` items.
 |
|   ↳ `content` | array of object (5 properties) | No |  |  | The content of the message, applicable for `message` items. 
- Message items of role `system` support only `input_text` content
- Message items of role `user` support `input_text` and `input_audio` 
  content
- Message items of role `assistant` support `text` content.
 |
|   ↳ `call_id` | string | No |  |  | The ID of the function call (for `function_call` and 
`function_call_output` items). If passed on a `function_call_output` 
item, the server will check that a `function_call` item with the same 
ID exists in the conversation history.
 |
|   ↳ `name` | string | No |  |  | The name of the function being called (for `function_call` items).
 |
|   ↳ `arguments` | string | No |  |  | The arguments of the function call (for `function_call` items).
 |
|   ↳ `output` | string | No |  |  | The output of the function call (for `function_call_output` items).
 |


### Items in `content` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `type` | string | No |  | `input_audio`, `input_text`, `item_reference`, `text` | The content type (`input_text`, `input_audio`, `item_reference`, `text`).
 |
| `text` | string | No |  |  | The text content, used for `input_text` and `text` content types.
 |
| `id` | string | No |  |  | ID of a previous conversation item to reference (for `item_reference`
content types in `response.create` events). These can reference both
client and server created items.
 |
| `audio` | string | No |  |  | Base64-encoded audio bytes, used for `input_audio` content type.
 |
| `transcript` | string | No |  |  | The transcript of the audio, used for `input_audio` content type.
 |

## Property Details

### `event_id` (required)

The unique ID of the server event.

**Type**: string

### `type` (required)

The event type, must be `conversation.item.created`.

**Type**: string

**Allowed values**: `conversation.item.created`

### `previous_item_id` (required)

The ID of the preceding item in the Conversation context, allows the 
client to understand the order of the conversation.


**Type**: string

### `item` (required)

The item to add to the conversation.

**Type**: object (10 properties)

**Nested Properties**:

* `id`, `type`, `object`, `status`, `role`, `content`, `call_id`, `name`, `arguments`, `output`

## Example

```json
{
    "event_id": "event_1920",
    "type": "conversation.item.created",
    "previous_item_id": "msg_002",
    "item": {
        "id": "msg_003",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "user",
        "content": []
    }
}

```

