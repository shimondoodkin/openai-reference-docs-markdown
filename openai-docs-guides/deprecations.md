Deprecations
============

Find deprecated features and recommended replacements.

Overview
--------

As we launch safer and more capable models, we regularly retire older models. Software relying on OpenAI models may need occasional updates to keep working. Impacted customers will always be notified by email and in our documentation along with [blog posts](https://openai.com/blog) for larger changes.

This page lists all API deprecations, along with recommended replacements.

Deprecation vs Legacy
---------------------

We use the term "deprecation" to refer to the process of retiring a model or endpoint. When we announce that a model or endpoint is being deprecated, it immediately becomes deprecated. All deprecated models and endpoints will also have a shut down date. At the time of the shut down, the model or endpoint will no longer be accessible.

We use the term "legacy" to refer to models and endpoints that will no longer receive updates. We tag endpoints and models as legacy to signal to developers where we are moving as a platform and that they should likely migrate to newer models or endpoints. You can expect that a legacy model or endpoint will be deprecated at some point in the future.

Deprecation history
-------------------

All deprecations are listed below, with the most recent announcements at the top.

### 2025-04-28: text-moderation

On April 28th, 2025, we notified developers using `text-moderation` of its deprecation and removal from the API in six months.

|Shutdown date|Model / system|Recommended replacement|
|---|---|---|
|2025-10-27|text-moderation-007|omni-moderation|
|2025-10-27|text-moderation-stable|omni-moderation|
|2025-10-27|text-moderation-latest|omni-moderation|

### 2025-04-28: o1-preview and o1-mini

On April 28th, 2025, we notified developers using `o1-preview` and `o1-mini` of their deprecations and removal from the API in three months and six months respectively.

|Shutdown date|Model / system|Recommended replacement|
|---|---|---|
|2025-07-28|o1-preview|o3|
|2025-10-27|o1-mini|o4-mini|

### 2025-04-14: GPT-4.5-preview

On April 14th, 2025, we notified developers that the `gpt-4.5-preview` model is deprecated and will be removed from the API in the coming months.

|Shutdown date|Model / system|Recommended replacement|
|---|---|---|
|2025-07-14|gpt-4.5-preview|gpt-4.1|

### 2024-10-02: Assistants API beta v1

In [April 2024](/docs/assistants/whats-new) when we released the v2 beta version of the Assistants API, we announced that access to the v1 beta would be shut off by the end of 2024. Access to the v1 beta will be discontinued on December 18, 2024.

See the Assistants API v2 beta [migration guide](/docs/assistants/migration) to learn more about how to migrate your tool usage to the latest version of the Assistants API.

|Shutdown date|Model / system|Recommended replacement|
|---|---|---|
|2024-12-18|OpenAI-Beta: assistants=v1|OpenAI-Beta: assistants=v2|

### 2024-08-29: Fine-tuning training on babbage-002 and davinci-002 models

On August 29th, 2024, we notified developers fine-tuning `babbage-002` and `davinci-002` that new fine-tuning training runs on these models will no longer be supported starting October 28, 2024.

Fine-tuned models created from these base models are not affected by this deprecation, but you will no longer be able to create new fine-tuned versions with these models.

|Shutdown date|Model / system|Recommended replacement|
|---|---|---|
|2024-10-28|New fine-tuning training on babbage-002|gpt-4o-mini|
|2024-10-28|New fine-tuning training on davinci-002|gpt-4o-mini|

### 2024-06-06: GPT-4-32K and Vision Preview models

On June 6th, 2024, we notified developers using `gpt-4-32k` and `gpt-4-vision-preview` of their upcoming deprecations in one year and six months respectively. As of June 17, 2024, only existing users of these models will be able to continue using them.

|Shutdown date|Deprecated model|Deprecated model price|Recommended replacement|
|---|---|---|---|
|2025-06-06|gpt-4-32k|$60.00 / 1M input tokens + $120 / 1M output tokens|gpt-4o|
|2025-06-06|gpt-4-32k-0613|$60.00 / 1M input tokens + $120 / 1M output tokens|gpt-4o|
|2025-06-06|gpt-4-32k-0314|$60.00 / 1M input tokens + $120 / 1M output tokens|gpt-4o|
|2024-12-06|gpt-4-vision-preview|$10.00 / 1M input tokens + $30 / 1M output tokens|gpt-4o|
|2024-12-06|gpt-4-1106-vision-preview|$10.00 / 1M input tokens + $30 / 1M output tokens|gpt-4o|

### 2023-11-06: Chat model updates

On November 6th, 2023, we [announced](https://openai.com/blog/new-models-and-developer-products-announced-at-devday) the release of an updated GPT-3.5-Turbo model (which now comes by default with 16k context) along with deprecation of `gpt-3.5-turbo-0613` and `gpt-3.5-turbo-16k-0613`. As of June 17, 2024, only existing users of these models will be able to continue using them.

|Shutdown date|Deprecated model|Deprecated model price|Recommended replacement|
|---|---|---|---|
|2024-09-13|gpt-3.5-turbo-0613|$1.50 / 1M input tokens + $2.00 / 1M output tokens|gpt-3.5-turbo|
|2024-09-13|gpt-3.5-turbo-16k-0613|$3.00 / 1M input tokens + $4.00 / 1M output tokens|gpt-3.5-turbo|

Fine-tuned models created from these base models are not affected by this deprecation, but you will no longer be able to create new fine-tuned versions with these models.

### 2023-08-22: Fine-tunes endpoint

On August 22nd, 2023, we [announced](https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates) the new fine-tuning API (`/v1/fine_tuning/jobs`) and that the original `/v1/fine-tunes` API along with legacy models (including those fine-tuned with the `/v1/fine-tunes` API) will be shut down on January 04, 2024. This means that models fine-tuned using the `/v1/fine-tunes` API will no longer be accessible and you would have to fine-tune new models with the updated endpoint and associated base models.

#### Fine-tunes endpoint

|Shutdown date|System|Recommended replacement|
|---|---|---|
|2024-01-04|/v1/fine-tunes|/v1/fine_tuning/jobs|

### 2023-07-06: GPT and embeddings

On July 06, 2023, we [announced](https://openai.com/blog/gpt-4-api-general-availability) the upcoming retirements of older GPT-3 and GPT-3.5 models served via the completions endpoint. We also announced the upcoming retirement of our first-generation text embedding models. They will be shut down on January 04, 2024.

#### InstructGPT models

|Shutdown date|Deprecated model|Deprecated model price|Recommended replacement|
|---|---|---|---|
|2024-01-04|text-ada-001|$0.40 / 1M tokens|gpt-3.5-turbo-instruct|
|2024-01-04|text-babbage-001|$0.50 / 1M tokens|gpt-3.5-turbo-instruct|
|2024-01-04|text-curie-001|$2.00 / 1M tokens|gpt-3.5-turbo-instruct|
|2024-01-04|text-davinci-001|$20.00 / 1M tokens|gpt-3.5-turbo-instruct|
|2024-01-04|text-davinci-002|$20.00 / 1M tokens|gpt-3.5-turbo-instruct|
|2024-01-04|text-davinci-003|$20.00 / 1M tokens|gpt-3.5-turbo-instruct|

Pricing for the replacement `gpt-3.5-turbo-instruct` model can be found on the [pricing page](https://openai.com/api/pricing).

#### Base GPT models

|Shutdown date|Deprecated model|Deprecated model price|Recommended replacement|
|---|---|---|---|
|2024-01-04|ada|$0.40 / 1M tokens|babbage-002|
|2024-01-04|babbage|$0.50 / 1M tokens|babbage-002|
|2024-01-04|curie|$2.00 / 1M tokens|davinci-002|
|2024-01-04|davinci|$20.00 / 1M tokens|davinci-002|
|2024-01-04|code-davinci-002|---|gpt-3.5-turbo-instruct|

Pricing for the replacement `babbage-002` and `davinci-002` models can be found on the [pricing page](https://openai.com/api/pricing).

#### Edit models & endpoint

|Shutdown date|Model / system|Recommended replacement|
|---|---|---|
|2024-01-04|text-davinci-edit-001|gpt-4o|
|2024-01-04|code-davinci-edit-001|gpt-4o|
|2024-01-04|/v1/edits|/v1/chat/completions|

#### Fine-tuning GPT models

|Shutdown date|Deprecated model|Training price|Usage price|Recommended replacement|
|---|---|---|---|---|
|2024-01-04|ada|$0.40 / 1M tokens|$1.60 / 1M tokens|babbage-002|
|2024-01-04|babbage|$0.60 / 1M tokens|$2.40 / 1M tokens|babbage-002|
|2024-01-04|curie|$3.00 / 1M tokens|$12.00 / 1M tokens|davinci-002|
|2024-01-04|davinci|$30.00 / 1M tokens|$120.00 / 1K tokens|davinci-002, gpt-3.5-turbo, gpt-4o|

#### First-generation text embedding models

|Shutdown date|Deprecated model|Deprecated model price|Recommended replacement|
|---|---|---|---|
|2024-01-04|text-similarity-ada-001|$4.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-ada-doc-001|$4.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-ada-query-001|$4.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|code-search-ada-code-001|$4.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|code-search-ada-text-001|$4.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-similarity-babbage-001|$5.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-babbage-doc-001|$5.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-babbage-query-001|$5.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|code-search-babbage-code-001|$5.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|code-search-babbage-text-001|$5.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-similarity-curie-001|$20.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-curie-doc-001|$20.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-curie-query-001|$20.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-similarity-davinci-001|$200.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-davinci-doc-001|$200.00 / 1M tokens|text-embedding-3-small|
|2024-01-04|text-search-davinci-query-001|$200.00 / 1M tokens|text-embedding-3-small|

### 2023-06-13: Updated chat models

On June 13, 2023, we announced new chat model versions in the [Function calling and other API updates](https://openai.com/blog/function-calling-and-other-api-updates) blog post. The three original versions will be retired in June 2024 at the earliest. As of January 10, 2024, only existing users of these models will be able to continue using them.

|Shutdown date|Legacy model|Legacy model price|Recommended replacement|
|---|---|---|---|
|at earliest 2024-06-13|gpt-4-0314|$30.00 / 1M input tokens + $60.00 / 1M output tokens|gpt-4o|

|Shutdown date|Deprecated model|Deprecated model price|Recommended replacement|
|---|---|---|---|
|2024-09-13|gpt-3.5-turbo-0301|$15.00 / 1M input tokens + $20.00 / 1M output tokens|gpt-3.5-turbo|
|2025-06-06|gpt-4-32k-0314|$60.00 / 1M input tokens + $120.00 / 1M output tokens|gpt-4o|

### 2023-03-20: Codex models

|Shutdown date|Deprecated model|Recommended replacement|
|---|---|---|
|2023-03-23|code-davinci-002|gpt-4o|
|2023-03-23|code-davinci-001|gpt-4o|
|2023-03-23|code-cushman-002|gpt-4o|
|2023-03-23|code-cushman-001|gpt-4o|

### 2022-06-03: Legacy endpoints

|Shutdown date|System|Recommended replacement|
|---|---|---|
|2022-12-03|/v1/engines|/v1/models|
|2022-12-03|/v1/search|View transition guide|
|2022-12-03|/v1/classifications|View transition guide|
|2022-12-03|/v1/answers|View transition guide|