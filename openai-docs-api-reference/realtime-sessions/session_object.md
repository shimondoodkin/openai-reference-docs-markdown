# The session object

A new Realtime session configuration, with an ephermeral key. Default TTL
for keys is one minute.


## Properties

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `client_secret` | object (2 properties) | Yes |  |  | Ephemeral key returned by the API. |
a standard API token, which should only be used server-side.
 |
|   ↳ `expires_at` | integer | Yes |  |  | Timestamp for when the token expires. Currently, all tokens expire
after one minute.
 |
| `modalities` | unknown | No |  |  | The set of modalities the model can respond with. To disable audio,
set this to ["text"].
 |
| `instructions` | string | No |  |  | The default system instructions (i.e. system message) prepended to model 
calls. This field allows the client to guide the model on desired 
responses. The model can be instructed on response content and format, 
(e.g. "be extremely succinct", "act friendly", "here are examples of good 
responses") and on audio behavior (e.g. "talk quickly", "inject emotion 
into your voice", "laugh frequently"). The instructions are not guaranteed 
to be followed by the model, but they provide guidance to the model on the 
desired behavior.

Note that the server sets default instructions which will be used if this 
field is not set and are visible in the `session.created` event at the 
start of the session.
 |
| `voice` | anyOf: string | string | No |  |  | The voice the model uses to respond. Voice cannot be changed during the 
session once the model has responded with audio at least once. Current 
voice options are `alloy`, `ash`, `ballad`, `coral`, `echo` `sage`, 
`shimmer` and `verse`.
 |
| `input_audio_format` | string | No |  |  | The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
 |
| `output_audio_format` | string | No |  |  | The format of output audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
 |
| `input_audio_transcription` | object (1 property) | No |  |  | Configuration for input audio transcription, defaults to off and can be 
set to `null` to turn off once on. Input audio transcription is not native 
to the model, since the model consumes audio directly. Transcription runs 
asynchronously through Whisper and should be treated as rough guidance 
rather than the representation understood by the model.
 |
 |
| `turn_detection` | object (4 properties) | No |  |  | Configuration for turn detection. Can be set to `null` to turn off. Server 
VAD means that the model will detect the start and end of speech based on 
audio volume and respond at the end of user speech.
 |
|   ↳ `threshold` | number | No |  |  | Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A 
higher threshold will require louder audio to activate the model, and 
thus might perform better in noisy environments.
 |
|   ↳ `prefix_padding_ms` | integer | No |  |  | Amount of audio to include before the VAD detected speech (in 
milliseconds). Defaults to 300ms.
 |
|   ↳ `silence_duration_ms` | integer | No |  |  | Duration of silence to detect speech stop (in milliseconds). Defaults 
to 500ms. With shorter values the model will respond more quickly, 
but may jump in on short pauses from the user.
 |
| `tools` | array of object (4 properties) | No |  |  | Tools (functions) available to the model. |
| `tool_choice` | string | No |  |  | How the model chooses tools. Options are `auto`, `none`, `required`, or 
specify a function.
 |
| `temperature` | number | No |  |  | Sampling temperature for the model, limited to [0.6, 1.2]. Defaults to 0.8.
 |
| `max_response_output_tokens` | oneOf: integer | string | No |  |  | Maximum number of output tokens for a single assistant response,
inclusive of tool calls. Provide an integer between 1 and 4096 to
limit output tokens, or `inf` for the maximum available tokens for a
given model. Defaults to `inf`.
 |


### Items in `tools` array

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `type` | string | No |  | `function` | The type of the tool, i.e. `function`. |
| `name` | string | No |  |  | The name of the function. |
| `description` | string | No |  |  | The description of the function, including guidance on when and how 
to call it, and guidance about what to tell the user when calling 
(if anything).
 |
| `parameters` | object | No |  |  | Parameters of the function in JSON Schema. |

## Property Details

### `client_secret` (required)

Ephemeral key returned by the API.

**Type**: object (2 properties)

**Nested Properties**:

* `value`, `expires_at`

### `modalities`

The set of modalities the model can respond with. To disable audio,
set this to ["text"].


**Type**: unknown

### `instructions`

The default system instructions (i.e. system message) prepended to model 
calls. This field allows the client to guide the model on desired 
responses. The model can be instructed on response content and format, 
(e.g. "be extremely succinct", "act friendly", "here are examples of good 
responses") and on audio behavior (e.g. "talk quickly", "inject emotion 
into your voice", "laugh frequently"). The instructions are not guaranteed 
to be followed by the model, but they provide guidance to the model on the 
desired behavior.

Note that the server sets default instructions which will be used if this 
field is not set and are visible in the `session.created` event at the 
start of the session.


**Type**: string

### `voice`

The voice the model uses to respond. Voice cannot be changed during the 
session once the model has responded with audio at least once. Current 
voice options are `alloy`, `ash`, `ballad`, `coral`, `echo` `sage`, 
`shimmer` and `verse`.


**Type**: anyOf: string | string

### `input_audio_format`

The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.


**Type**: string

### `output_audio_format`

The format of output audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.


**Type**: string

### `input_audio_transcription`

Configuration for input audio transcription, defaults to off and can be 
set to `null` to turn off once on. Input audio transcription is not native 
to the model, since the model consumes audio directly. Transcription runs 
asynchronously through Whisper and should be treated as rough guidance 
rather than the representation understood by the model.


**Type**: object (1 property)

**Nested Properties**:

* `model`

### `turn_detection`

Configuration for turn detection. Can be set to `null` to turn off. Server 
VAD means that the model will detect the start and end of speech based on 
audio volume and respond at the end of user speech.


**Type**: object (4 properties)

**Nested Properties**:

* `type`, `threshold`, `prefix_padding_ms`, `silence_duration_ms`

### `tools`

Tools (functions) available to the model.

**Type**: array of object (4 properties)

### `tool_choice`

How the model chooses tools. Options are `auto`, `none`, `required`, or 
specify a function.


**Type**: string

### `temperature`

Sampling temperature for the model, limited to [0.6, 1.2]. Defaults to 0.8.


**Type**: number

### `max_response_output_tokens`

Maximum number of output tokens for a single assistant response,
inclusive of tool calls. Provide an integer between 1 and 4096 to
limit output tokens, or `inf` for the maximum available tokens for a
given model. Defaults to `inf`.


**Type**: oneOf: integer | string

## Example

```json
{
  "id": "sess_001",
  "object": "realtime.session",
  "model": "gpt-4o-realtime-preview",
  "modalities": ["audio", "text"],
  "instructions": "You are a friendly assistant.",
  "voice": "alloy",
  "input_audio_format": "pcm16",
  "output_audio_format": "pcm16",
  "input_audio_transcription": {
      "model": "whisper-1"
  },
  "turn_detection": null,
  "tools": [],
  "tool_choice": "none",
  "temperature": 0.7,
  "max_response_output_tokens": 200,
  "client_secret": {
    "value": "ek_abc123", 
    "expires_at": 1234567890
  }
}

```

