# The transcription session object

A new Realtime transcription session configuration.

When a session is created on the server via REST API, the session object
also contains an ephemeral key. Default TTL for keys is one minute. This 
property is not present when a session is updated via the WebSocket API.


## Properties

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `client_secret` | object (2 properties) | Yes |  |  | Ephemeral key returned by the API. Only present when the session is
created on the server via REST API.
 |
a standard API token, which should only be used server-side.
 |
|   ↳ `expires_at` | integer | Yes |  |  | Timestamp for when the token expires. Currently, all tokens expire
after one minute.
 |
| `modalities` | unknown | No |  |  | The set of modalities the model can respond with. To disable audio,
set this to ["text"].
 |
| `input_audio_format` | string | No |  |  | The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
 |
| `input_audio_transcription` | object (3 properties) | No |  |  | Configuration of the transcription model.
 |
|   ↳ `language` | string | No |  |  | The language of the input audio. Supplying the input language in
[ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g. `en`) format
will improve accuracy and latency.
 |
|   ↳ `prompt` | string | No |  |  | An optional text to guide the model's style or continue a previous audio
segment. The [prompt](/docs/guides/speech-to-text#prompting) should match
the audio language.
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

## Property Details

### `client_secret` (required)

Ephemeral key returned by the API. Only present when the session is
created on the server via REST API.


**Type**: object (2 properties)

**Nested Properties**:

* `value`, `expires_at`

### `modalities`

The set of modalities the model can respond with. To disable audio,
set this to ["text"].


**Type**: unknown

### `input_audio_format`

The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.


**Type**: string

### `input_audio_transcription`

Configuration of the transcription model.


**Type**: object (3 properties)

**Nested Properties**:

* `model`, `language`, `prompt`

### `turn_detection`

Configuration for turn detection. Can be set to `null` to turn off. Server 
VAD means that the model will detect the start and end of speech based on 
audio volume and respond at the end of user speech.


**Type**: object (4 properties)

**Nested Properties**:

* `type`, `threshold`, `prefix_padding_ms`, `silence_duration_ms`

## Example

```json
{
  "id": "sess_BBwZc7cFV3XizEyKGDCGL",
  "object": "realtime.transcription_session",
  "expires_at": 1742188264,
  "modalities": ["audio", "text"],
  "turn_detection": {
    "type": "server_vad",
    "threshold": 0.5,
    "prefix_padding_ms": 300,
    "silence_duration_ms": 200
  },
  "input_audio_format": "pcm16",
  "input_audio_transcription": {
    "model": "gpt-4o-transcribe",
    "language": null,
    "prompt": ""
  },
  "client_secret": null
}

```

