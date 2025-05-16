# transcription_session.updated

Returned when a transcription session is updated with a `transcription_session.update` event, unless 
there is an error.


## Properties

| Property | Type | Required | Default | Allowed Values | Description |
| -------- | ---- | -------- | ------- | -------------- | ----------- |
| `event_id` | string | Yes |  |  | The unique ID of the server event. |
| `type` | string | Yes |  | `transcription_session.updated` | The event type, must be `transcription_session.updated`. |
| `session` | object (5 properties) | Yes |  |  | A new Realtime transcription session configuration.

When a session is created on the server via REST API, the session object
also contains an ephemeral key. Default TTL for keys is one minute. This 
property is not present when a session is updated via the WebSocket API.
 |
 |
a standard API token, which should only be used server-side.
 |
|     ↳ `expires_at` | integer | Yes |  |  | Timestamp for when the token expires. Currently, all tokens expire
after one minute.
 |
|   ↳ `modalities` | unknown | No |  |  | The set of modalities the model can respond with. To disable audio,
set this to ["text"].
 |
|   ↳ `input_audio_format` | string | No |  |  | The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
 |
|   ↳ `input_audio_transcription` | object (3 properties) | No |  |  | Configuration of the transcription model.
 |
|     ↳ `language` | string | No |  |  | The language of the input audio. Supplying the input language in
[ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g. `en`) format
will improve accuracy and latency.
 |
|     ↳ `prompt` | string | No |  |  | An optional text to guide the model's style or continue a previous audio
segment. The [prompt](/docs/guides/speech-to-text#prompting) should match
the audio language.
 |
|   ↳ `turn_detection` | object (4 properties) | No |  |  | Configuration for turn detection. Can be set to `null` to turn off. Server 
VAD means that the model will detect the start and end of speech based on 
audio volume and respond at the end of user speech.
 |
|     ↳ `threshold` | number | No |  |  | Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A 
higher threshold will require louder audio to activate the model, and 
thus might perform better in noisy environments.
 |
|     ↳ `prefix_padding_ms` | integer | No |  |  | Amount of audio to include before the VAD detected speech (in 
milliseconds). Defaults to 300ms.
 |
|     ↳ `silence_duration_ms` | integer | No |  |  | Duration of silence to detect speech stop (in milliseconds). Defaults 
to 500ms. With shorter values the model will respond more quickly, 
but may jump in on short pauses from the user.
 |

## Property Details

### `event_id` (required)

The unique ID of the server event.

**Type**: string

### `type` (required)

The event type, must be `transcription_session.updated`.

**Type**: string

**Allowed values**: `transcription_session.updated`

### `session` (required)

A new Realtime transcription session configuration.

When a session is created on the server via REST API, the session object
also contains an ephemeral key. Default TTL for keys is one minute. This 
property is not present when a session is updated via the WebSocket API.


**Type**: object (5 properties)

**Nested Properties**:

* `client_secret`, `modalities`, `input_audio_format`, `input_audio_transcription`, `turn_detection`

## Example

```json
{
  "event_id": "event_5678",
  "type": "transcription_session.updated",
  "session": {
    "id": "sess_001",
    "object": "realtime.transcription_session",
    "input_audio_format": "pcm16",
    "input_audio_transcription": {
      "model": "gpt-4o-transcribe",
      "prompt": "",
      "language": ""
    },
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 500,
      "create_response": true,
      // "interrupt_response": false  -- this will NOT be returned
    },
    "input_audio_noise_reduction": {
      "type": "near_field"
    },
    "include": [
      "item.input_audio_transcription.avg_logprob",
    ],
  }
}

```

