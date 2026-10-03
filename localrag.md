> For the complete MongoDB documentation index, see www.mongodb.com/docs/llms.txt

<!--
Tab options on this page. Append to the .md URL to filter:
  ?tabs=<id,...>   select specific tabs (e.g. ?tabs=nodejs,shell)
  ?allTabs=true    include every tab
  (no param)       default: one tab per tabset

Available tabs:
  other tabs: dotnet-nine, dotnet-eight, local, cloud, maven, gradle, user-access-token, ssh
-->

# Build a Local RAG Implementation with MongoDB Vector Search

This tutorial demonstrates how to implement retrieval-augmented generation (RAG) locally, without the need for API (Application Programming Interface) keys or credits. To learn more about RAG (Retrieval-Augmented Generation), see [Retrieval-Augmented Generation (RAG) with MongoDB.](https://www.mongodb.com/docs/vector-search/tutorials/rag.md#std-label-ai-key-concepts)

Specifically, you perform the following actions:

1. Create a local Atlas deployment.

2. Set up the environment.

3. Use a local embedding model to generate vector embeddings.

4. Create a MongoDB Vector Search index on your data.

5. Use a local LLM to answer questions on your data.

Work with a runnable version of this tutorial as a [Python notebook.](https://github.com/mongodb/docs-notebooks/blob/main/use-cases/local-rag.ipynb)

**Note:**

For a local RAG (Retrieval-Augmented Generation) implementation with LangChain, see [Build a Local RAG Implementation with MongoDB and LangChain.](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/local-rag.md#std-label-langchain-local-rag)

Work with a runnable version of this tutorial as a [Python notebook.](https://github.com/mongodb/docs-notebooks/blob/main/use-cases/local-rag.ipynb)

**Note:**

For a local RAG (Retrieval-Augmented Generation) implementation with LangChain, see [Build a Local RAG Implementation with MongoDB and LangChain.](https://www.mongodb.com/docs/atlas/ai-integrations/langchain/local-rag.md#std-label-langchain-local-rag)

## About this Tutorial

In this tutorial, you create a local Atlas deployment using Python and Docker through the `atlas-local-lib-py` library. This library simplifies deployment management by automatically handling Docker containers and providing programmatic access to connection strings. To learn more, see the [atlas-local-lib-py repository.](https://github.com/mongodb/atlas-local-lib-py)

You can also use a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed.

**Note:**

Local Atlas deployments are intended for testing only. For production environments, [deploy a cluster.](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster.md#std-label-create-new-cluster)

You also use the following open-source models in this tutorial:

- [Nomic Embed Text](https://ollama.com/library/nomic-embed-text) embedding model

- [Mistral 7B](https://ollama.com/library/mistral) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download [Ollama](https://ollama.com/) and pull the open source models listed above to perform RAG (Retrieval-Augmented Generation) tasks.

This tutorial also uses the [Microsoft.Extensions.AI.Ollama](https://aka.ms/meai-ollama-nuget) package to connect to these models and integrate them with MongoDB Vector Search. If you prefer different models or a different framework, you can adapt this tutorial by replacing the Ollama model names with their equivalents for your preferred setup.

You also use the following open-source models in this tutorial:

- [Nomic Embed Text](https://ollama.com/library/nomic-embed-text) embedding model

- [Mistral 7B](https://ollama.com/library/mistral) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download [Ollama](https://ollama.com/) and pull the open source models listed above to perform RAG (Retrieval-Augmented Generation) tasks.

This tutorial also uses the [Microsoft.Extensions.AI.Ollama](https://aka.ms/meai-ollama-nuget) package to connect to these models and integrate them with MongoDB Vector Search. If you prefer different models or a different framework, you can adapt this tutorial by replacing the Ollama model names with their equivalents for your preferred setup.

You also use the following open-source models in this tutorial:

- [Nomic Embed Text](https://ollama.com/library/nomic-embed-text) embedding model

- [Mistral 7B](https://ollama.com/library/mistral) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download [Ollama](https://ollama.com/) and pull the open source models listed above to perform RAG (Retrieval-Augmented Generation) tasks.

This tutorial also uses the [Go language port of LangChain](https://tmc.github.io/langchaingo/docs/), a popular open-source LLM framework, to connect to these models and integrate them with MongoDB Vector Search. If you prefer different models or a different framework, you can adapt this tutorial by replacing the Ollama model names or LangChain library components with their equivalents for your preferred setup.

You also use the following open-source models in this tutorial:

- [Nomic Embed Text](https://ollama.com/library/nomic-embed-text) embedding model

- [Mistral 7B](https://ollama.com/library/mistral) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download [Ollama](https://ollama.com/) and pull the open source models listed above to perform RAG (Retrieval-Augmented Generation) tasks.

This tutorial also uses the [Go language port of LangChain](https://tmc.github.io/langchaingo/docs/), a popular open-source LLM framework, to connect to these models and integrate them with MongoDB Vector Search. If you prefer different models or a different framework, you can adapt this tutorial by replacing the Ollama model names or LangChain library components with their equivalents for your preferred setup.

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download [Ollama](https://ollama.com/) and pull the following open source models to perform RAG (Retrieval-Augmented Generation) tasks:

- [Nomic Embed Text](https://ollama.com/library/nomic-embed-text) embedding model

- [Mistral 7B](https://ollama.com/library/mistral) generative model

This tutorial also uses [LangChain4j](https://docs.langchain4j.dev/intro/), a popular open-source LLM framework for Java, to connect to these models and integrate them with MongoDB Vector Search. If you prefer different models or a different framework, you can adapt this tutorial by replacing the Ollama model names or LangChain4j library components with their equivalents for your preferred setup.

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download [Ollama](https://ollama.com/) and pull the following open source models to perform RAG (Retrieval-Augmented Generation) tasks:

- [Nomic Embed Text](https://ollama.com/library/nomic-embed-text) embedding model

- [Mistral 7B](https://ollama.com/library/mistral) generative model

This tutorial also uses [LangChain4j](https://docs.langchain4j.dev/intro/), a popular open-source LLM framework for Java, to connect to these models and integrate them with MongoDB Vector Search. If you prefer different models or a different framework, you can adapt this tutorial by replacing the Ollama model names or LangChain4j library components with their equivalents for your preferred setup.

You also use the following open-source models in this tutorial:

- [mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) embedding model

- [Mistral 7B](https://docs.mistral.ai/getting-started/models/) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download the Mistral 7B model by using [GPT4All](https://gpt4all.io/index.html), an open-source ecosystem for local LLM development.

You also use the following open-source models in this tutorial:

- [mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) embedding model

- [Mistral 7B](https://docs.mistral.ai/getting-started/models/) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download the Mistral 7B model by using [GPT4All](https://gpt4all.io/index.html), an open-source ecosystem for local LLM development.

When working through this tutorial, you use an interactive Python notebook. This environment allows you to create and execute individual code blocks without running the entire file each time.

You also use the following open-source models in this tutorial:

- [mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) embedding model

- [Mistral 7B](https://docs.mistral.ai/getting-started/models/) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download the Mistral 7B model by using [GPT4All](https://gpt4all.io/index.html), an open-source ecosystem for local LLM development.

When working through this tutorial, you use an interactive Python notebook. This environment allows you to create and execute individual code blocks without running the entire file each time.

You also use the following open-source models in this tutorial:

- [mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) embedding model

- [Mistral 7B](https://docs.mistral.ai/getting-started/models/) generative model

There are several ways to download and deploy LLM (Large Language Model)s locally. In this tutorial, you download the Mistral 7B model by using [GPT4All](https://gpt4all.io/index.html), an open-source ecosystem for local LLM development.

## Prerequisites

In addition to the [common prerequisites](https://www.mongodb.com/docs/vector-search/about/use-cases.md#std-label-avs-tutorials-prereqs), this tutorial requires the following:

- The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

- [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

- A terminal and code editor to run your .NET project.

- [.NET version 8.0 or higher](https://dotnet.microsoft.com/en-us/download) installed.

- [Ollama](https://ollama.com/) installed.

* The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

* [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

* A terminal and code editor to run your .NET project.

* [.NET version 8.0 or higher](https://dotnet.microsoft.com/en-us/download) installed.

* [Ollama](https://ollama.com/) installed.

- The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

- [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

- A terminal and code editor to run your Go project.

- [Go](https://go.dev/doc/install) installed.

- [Ollama](https://ollama.com/) installed.

* The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

* [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

* A terminal and code editor to run your Go project.

* [Go](https://go.dev/doc/install) installed.

* [Ollama](https://ollama.com/) installed.

- The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

- [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

* [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) version 8 or later.

* An environment to set up and run a Java application. We recommend that you use an integrated development environment (IDE) such as [IntelliJ IDEA](https://www.jetbrains.com/idea/) or [Eclipse IDE](https://eclipseide.org/) to configure Maven or Gradle to build and run your project.

- [Ollama](https://ollama.com/) installed.

* The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

* [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) version 8 or later.

- An environment to set up and run a Java application. We recommend that you use an integrated development environment (IDE) such as [IntelliJ IDEA](https://www.jetbrains.com/idea/) or [Eclipse IDE](https://eclipseide.org/) to configure Maven or Gradle to build and run your project.

* [Ollama](https://ollama.com/) installed.

- The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

- [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

- A [Hugging Face Access Token](https://huggingface.co/docs/hub/en/security-tokens) with read access.

- [Git Large File Storage](https://git-lfs.com/) installed.

- A terminal and code editor to run your Node.js project.

- [npm and Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

* The [Atlas CLI](https://www.mongodb.com/docs/atlas/cli/current/) installed and running v1.14.3 or later.

* [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) installed.

* A [Hugging Face Access Token](https://huggingface.co/docs/hub/en/security-tokens) with read access.

* [Git Large File Storage](https://git-lfs.com/) installed.

* A terminal and code editor to run your Node.js project.

* [npm and Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

- Python v3.10 or later.

- [Docker](https://www.docker.com/) installed and running.

- An interactive Python notebook that you can run locally. You can run interactive Python notebooks in [VS Code.](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)

* Python v3.10 or later.

* [Docker](https://www.docker.com/) installed and running.

* An interactive Python notebook that you can run locally. You can run interactive Python notebooks in [VS Code.](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)

## Create a Local Deployment

For Python, you create the local deployment programmatically as part of the environment setup in the next section using the `atlas-local-lib-py` library. Skip to [Set Up the Environment.](https://www.mongodb.com/docs/vector-search/tutorials/local-rag.md#std-label-local-rag-set-up-environment)

For Python, you create the local deployment programmatically as part of the environment setup in the next section using the `atlas-local-lib-py` library. Skip to [Set Up the Environment.](https://www.mongodb.com/docs/vector-search/tutorials/local-rag.md#std-label-local-rag-set-up-environment)

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

In this section, you create local Atlas deployment loaded with the [sample AirBnB listings](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) dataset to use as a vector database.

**Note:**

If you already have an existing local deployment or a MongoDB Community or Enterprise cluster with [Search and Vector Search](https://www.mongodb.com/docs/search/self-managed/current/installation/linux.md#std-label-community-search-deploy) installed, with the `sample_airbnb.listingsAndReviews` sample data loaded, you can skip this step.

1. Create a local deployment by using the Atlas CLI.

   Run `atlas deployments setup` and follow the prompts to create a local deployment.

   For detailed instructions, see [Create a Local Atlas Deployment.](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-deploy-local/#create-a-local-atlas-deployment-1)

2. Load the sample data into your deployment.

   Run the following command in your terminal to download the sample data:

   ```text
   curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
   ```

   Run the following command to load the data into your deployment, replacing `<port-number>` with the port where you're hosting the deployment:

   ```text
   mongorestore --archive=sampledata.archive --port=<port-number>
   ```

   **Note:**

   You must install [MongoDB Command Line Database Tools](https://fastdl.mongodb.org/tools/db/mongodb-database-tools-macos-arm64-100.10.0.zip) to access the `mongorestore` command.

## Set Up the Environment

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Initialize your .NET project.

   Run the following commands in your terminal to create a new directory named `MyCompany.RAG.Local` and initialize your project:

   ```console
   dotnet new console -o MyCompany.RAG.Local
   cd MyCompany.RAG.Local
   ```

2. Install and import dependencies.

   ### .NET 9.x+

   Run the following commands:

   ```console
   dotnet add package MongoDB.Driver --version 3.1.0
   dotnet add package Microsoft.Extensions.AI.Ollama --prerelease
   ```

3. Set your connection string as an environment variable.

   Export your connection string, `set` it in PowerShell, or use your IDE's environment variable manager to make the connection string available to your project.

   ```shell
   export MONGODB_URI="<connection-string>"
   ```

   Replace the `<connection-string>` placeholder value with your Atlas connection string.

   ### Local Deployment

   If you're using a local Atlas deployment, your connection string follows this format, replacing `<port-number>` with the port for your local deployment.

   ```text
   export MONGODB_URI="mongodb://localhost:<port-number>/?directConnection=true"
   ```

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Initialize your .NET project.

   Run the following commands in your terminal to create a new directory named `MyCompany.RAG.Local` and initialize your project:

   ```console
   dotnet new console -o MyCompany.RAG.Local
   cd MyCompany.RAG.Local
   ```

2. Install and import dependencies.

   ### .NET 9.x+

   Run the following commands:

   ```console
   dotnet add package MongoDB.Driver --version 3.1.0
   dotnet add package Microsoft.Extensions.AI.Ollama --prerelease
   ```

3. Set your connection string as an environment variable.

   Export your connection string, `set` it in PowerShell, or use your IDE's environment variable manager to make the connection string available to your project.

   ```shell
   export MONGODB_URI="<connection-string>"
   ```

   Replace the `<connection-string>` placeholder value with your Atlas connection string.

   ### Local Deployment

   If you're using a local Atlas deployment, your connection string follows this format, replacing `<port-number>` with the port for your local deployment.

   ```text
   export MONGODB_URI="mongodb://localhost:<port-number>/?directConnection=true"
   ```

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Initialize your Go project.

   Run the following commands in your terminal to create a new directory named `local-rag-mongodb` and initialize your project:

   ```console
   mkdir local-rag-mongodb
   cd local-rag-mongodb
   go mod init local-rag-mongodb
   ```

2. Install and import dependencies.

   Run the following commands:

   ```console
   go get github.com/joho/godotenv
   go get go.mongodb.org/mongo-driver/v2/mongo
   go get github.com/tmc/langchaingo/llms
   go get github.com/tmc/langchaingo/llms/ollama
   go get github.com/tmc/langchaingo/prompts
   go get github.com/tmc/langchaingo/vectorstores/mongovector
   ```

3. Create a `.env` file.

   In your project, create a `.env` file to store your connection string.

   ```text
   MONGODB_URI = "<connection-string>"
   ```

   Replace the `<connection-string>` placeholder value with your Atlas connection string.

   ### Local Deployment

   If you're using a local Atlas deployment, your connection string follows this format, replacing `<port-number>` with the port for your local deployment.

   ```text
   MONGODB_URI = "mongodb://localhost:<port-number>/?directConnection=true"
   ```

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Initialize your Go project.

   Run the following commands in your terminal to create a new directory named `local-rag-mongodb` and initialize your project:

   ```console
   mkdir local-rag-mongodb
   cd local-rag-mongodb
   go mod init local-rag-mongodb
   ```

2. Install and import dependencies.

   Run the following commands:

   ```console
   go get github.com/joho/godotenv
   go get go.mongodb.org/mongo-driver/v2/mongo
   go get github.com/tmc/langchaingo/llms
   go get github.com/tmc/langchaingo/llms/ollama
   go get github.com/tmc/langchaingo/prompts
   go get github.com/tmc/langchaingo/vectorstores/mongovector
   ```

3. Create a `.env` file.

   In your project, create a `.env` file to store your connection string.

   ```text
   MONGODB_URI = "<connection-string>"
   ```

   Replace the `<connection-string>` placeholder value with your Atlas connection string.

   ### Local Deployment

   If you're using a local Atlas deployment, your connection string follows this format, replacing `<port-number>` with the port for your local deployment.

   ```text
   MONGODB_URI = "mongodb://localhost:<port-number>/?directConnection=true"
   ```

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Create your Java project and install dependencies.

   From your IDE, create a Java project named `local-rag-mongodb` using Maven or Gradle.

   Add the following dependencies, depending on your package manager:

   ### Maven

   If you are using Maven, add the following dependencies to the `dependencies` array in your project's `pom.xml` file:

   ```xml
   <dependencies>
      <!-- MongoDB Java Sync Driver v5.2.0 or later -->
      <dependency>
         <groupId>org.mongodb</groupId>
         <artifactId>mongodb-driver-sync</artifactId>
         <version>[5.2.0,)</version> </dependency> <!-- Java library for working with Ollama --> <dependency> <groupId>dev.langchain4j</groupId> <artifactId>langchain4j-ollama</artifactId> <version>0.35.0</version> </dependency> </dependencies> ``` Run your package manager to install the dependencies to your project. 2. Set your environment variable. **Note:** This example sets the variable in the IDE. Production applications might manage environment variables through a deployment configuration, CI/CD pipeline, or secrets manager, but you can adapt the provided code to fit your use case. In your IDE, create a new configuration template and add the following variables to your project: - If you are using IntelliJ IDEA, create a new Application run configuration template, then add your variables as semicolon-separated values in the Environment variables field (for example, `FOO=123;BAR=456`). Apply the changes and click OK. To learn more, see the [Create a run/debug configuration from a template](https://www.jetbrains.com/help/idea/run-debug-configuration.html#createExplicitly) section of the IntelliJ IDEA documentation.

   - If you are using Eclipse, create a new Java Application launch configuration, then add each variable as a new key-value pair in the Environment tab. Apply the changes and click OK.

     To learn more, see the [Creating a Java application launch configuration](https://help.eclipse.org/latest/topic/org.eclipse.jdt.doc.user/tasks/tasks-java-local-configuration.htm) section of the Eclipse IDE documentation.

   ### Local Deployment

   Replace the `<port-number>` with the port for your local deployment.

   Your connection string should follow the following format:

   ```shell
   MONGODB_URI = "mongodb://localhost:<port-number>/?directConnection=true"
   ```

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Create your Java project and install dependencies.

   From your IDE, create a Java project named `local-rag-mongodb` using Maven or Gradle.

   Add the following dependencies, depending on your package manager:

   ### Maven

   If you are using Maven, add the following dependencies to the `dependencies` array in your project's `pom.xml` file:

   ```xml
   <dependencies>
      <!-- MongoDB Java Sync Driver v5.2.0 or later -->
      <dependency>
         <groupId>org.mongodb</groupId>
         <artifactId>mongodb-driver-sync</artifactId>
         <version>[5.2.0,)</version> </dependency> <!-- Java library for working with Ollama --> <dependency> <groupId>dev.langchain4j</groupId> <artifactId>langchain4j-ollama</artifactId> <version>0.35.0</version> </dependency> </dependencies> ``` Run your package manager to install the dependencies to your project. 2. Set your environment variable. **Note:** This example sets the variable in the IDE. Production applications might manage environment variables through a deployment configuration, CI/CD pipeline, or secrets manager, but you can adapt the provided code to fit your use case. In your IDE, create a new configuration template and add the following variables to your project: - If you are using IntelliJ IDEA, create a new Application run configuration template, then add your variables as semicolon-separated values in the Environment variables field (for example, `FOO=123;BAR=456`). Apply the changes and click OK. To learn more, see the [Create a run/debug configuration from a template](https://www.jetbrains.com/help/idea/run-debug-configuration.html#createExplicitly) section of the IntelliJ IDEA documentation.

   - If you are using Eclipse, create a new Java Application launch configuration, then add each variable as a new key-value pair in the Environment tab. Apply the changes and click OK.

     To learn more, see the [Creating a Java application launch configuration](https://help.eclipse.org/latest/topic/org.eclipse.jdt.doc.user/tasks/tasks-java-local-configuration.htm) section of the Eclipse IDE documentation.

   ### Local Deployment

   Replace the `<port-number>` with the port for your local deployment.

   Your connection string should follow the following format:

   ```shell
   MONGODB_URI = "mongodb://localhost:<port-number>/?directConnection=true"
   ```

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Initialize your Node.js project.

   Run the following commands in your terminal to create a new directory named `local-rag-mongodb` and initialize your project:

   ```console
   mkdir local-rag-mongodb
   cd local-rag-mongodb
   npm init -y
   ```

2. Install and import dependencies.

   Run the following command:

   ```console
   npm install mongodb @xenova/transformers node-gyp gpt4all
   ```

3. Update your `package.json` file.

   In your project's `package.json` file, specify the `type` field as shown in the following example, and then save the file.

   ```json
   {
      "name": "local-rag-mongodb",
      "type": "module",
      ...
   }
   ```

4. Create a `.env` file.

   In your project, create a `.env` file to store your connection string.

   ```javascript
   MONGODB_URI = "<connection-string>"
   ```

   Replace the `<connection-string>` placeholder value with your Atlas connection string.

   ### Local Deployment

   If you're using a local Atlas deployment, your connection string follows this format, replacing `<port-number>` with the port for your local deployment.

   ```javascript
   MONGODB_URI = "mongodb://localhost:<port-number>/?directConnection=true";
   ```

   **Note: Minimum Node.js Version Requirements**

   Node.js v20.x introduced the `--env-file` option. If you are using an older version of Node.js, add the `dotenv` package to your project, or use a different method to manage your environment variables.

In this section, you set up the environment for this tutorial. Create a project, install the required packages, and define a connection string:

1. Initialize your Node.js project.

   Run the following commands in your terminal to create a new directory named `local-rag-mongodb` and initialize your project:

   ```console
   mkdir local-rag-mongodb
   cd local-rag-mongodb
   npm init -y
   ```

2. Install and import dependencies.

   Run the following command:

   ```console
   npm install mongodb @xenova/transformers node-gyp gpt4all
   ```

3. Update your `package.json` file.

   In your project's `package.json` file, specify the `type` field as shown in the following example, and then save the file.

   ```json
   {
      "name": "local-rag-mongodb",
      "type": "module",
      ...
   }
   ```

4. Create a `.env` file.

   In your project, create a `.env` file to store your connection string.

   ```javascript
   MONGODB_URI = "<connection-string>"
   ```

   Replace the `<connection-string>` placeholder value with your Atlas connection string.

   ### Local Deployment

   If you're using a local Atlas deployment, your connection string follows this format, replacing `<port-number>` with the port for your local deployment.

   ```javascript
   MONGODB_URI = "mongodb://localhost:<port-number>/?directConnection=true";
   ```

   **Note: Minimum Node.js Version Requirements**

   Node.js v20.x introduced the `--env-file` option. If you are using an older version of Node.js, add the `dotenv` package to your project, or use a different method to manage your environment variables.

In this section, you set up the environment for this tutorial.

1. Create a directory to store your project.

   Run the following commands in your terminal to create a new directory named `local-rag-mongodb`.

   ```console
   mkdir local-rag-mongodb
   cd local-rag-mongodb
   ```

2. Create an interactive Python notebook.

   The following command creates a notebook in the directory named `local-rag.ipynb`.

   ```shell
   touch local-rag.ipynb
   ```

3. Install and import dependencies.

   Run the following command in your notebook:

   ```python
   pip install --quiet --upgrade pymongo gpt4all sentence_transformers atlas-local-lib-py
   ```

4. Create or reuse a local Atlas deployment.

   Run the following code in your notebook to create a new local deployment or reuse an existing one with matching configuration. This also retrieves the connection string programmatically.

   ```python
   from atlas_local import LocalDeployment

   deployment = LocalDeployment.get_or_create(name="local-atlas-deployment")
   MONGODB_URI = deployment.connection_string()
   ```

In this section, you set up the environment for this tutorial.

1. Create a directory to store your project.

   Run the following commands in your terminal to create a new directory named `local-rag-mongodb`.

   ```console
   mkdir local-rag-mongodb
   cd local-rag-mongodb
   ```

2. Create an interactive Python notebook.

   The following command creates a notebook in the directory named `local-rag.ipynb`.

   ```shell
   touch local-rag.ipynb
   ```

3. Install and import dependencies.

   Run the following command in your notebook:

   ```python
   pip install --quiet --upgrade pymongo gpt4all sentence_transformers atlas-local-lib-py
   ```

4. Create or reuse a local Atlas deployment.

   Run the following code in your notebook to create a new local deployment or reuse an existing one with matching configuration. This also retrieves the connection string programmatically.

   ```python
   from atlas_local import LocalDeployment

   deployment = LocalDeployment.get_or_create(name="local-atlas-deployment")
   MONGODB_URI = deployment.connection_string()
   ```

## Generate Embeddings with a Local Model

In this section, you load an embedding model locally and generate vector embeddings by using data from the [sample\_airbnb](https://www.mongodb.com/docs/manual/sample-data/sample-airbnb.md#std-label-sample-airbnb) database, which contains a collection called `listingsAndReviews`.

1. Download the local embedding model.

   This example uses the [nomic-embed-text](https://ollama.com/library/nomic-embed-text) model from Ollama.

   Run the following command to pull the embedding model:

   ```console
   ollama pull nomic-embed-text
   ```

2. Generate embeddings.

   To encapsulate the logic for each piece of the implementation, create a few classes to coordinate and manage the services.

   Create a file called `OllamaAIService.cs`, and paste the following code into it:

   ```csharp
   using Microsoft.Extensions.AI;

   namespace MyCompany.RAG.Local;

   public class OllamaAIService
   {
       private static readonly Uri OllamaUri = new("http://localhost:11434/");
       private static readonly string EmbeddingModelName = "nomic-embed-text";
       private static readonly OllamaEmbeddingGenerator EmbeddingGenerator = new OllamaEmbeddingGenerator(OllamaUri, EmbeddingModelName);
       private static readonly string ChatModelName = "mistral";
       private static readonly OllamaChatClient ChatClient = new OllamaChatClient(OllamaUri, ChatModelName);

       public async Task<float[]> GetEmbedding(string text)
       {
           var embedding = await EmbeddingGenerator.GenerateVectorAsync(text);
           return embedding.ToArray();
       }

       public async Task<string> SummarizeAnswer(string context)
       {
           string question = "Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.";

           string prompt = $"""
                            Use the following pieces of context to answer the question at the end.
                            Context: {context}
                            Question: {question}
                            """;

           ChatResponse response = await ChatClient.GetResponseAsync(prompt, new ChatOptions { MaxOutputTokens = 400 });
           return response.Text;
       }
   }

   ```

   This class also defines the chat model and the `SummarizeAnswer()` method that you use later to answer questions on your data.

   Create another file called `MongoDBDataService.cs` and paste the following code into it:

   ```csharp
   using MongoDB.Bson;
   using MongoDB.Driver;

   namespace MyCompany.RAG.Local;

   public class MongoDBDataService
   {
       private static readonly string? ConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
       private static readonly MongoClient Client = new MongoClient(ConnectionString);
       private static readonly IMongoDatabase Database = Client.GetDatabase("sample_airbnb");
       private static readonly IMongoCollection<BsonDocument> Collection = Database.GetCollection<BsonDocument>("listingsAndReviews");

       public List<BsonDocument>? GetDocuments()
       {
           var filter = Builders<BsonDocument>.Filter.And(
               Builders<BsonDocument>.Filter.And(
                   Builders<BsonDocument>.Filter.Exists("summary", true),
                   Builders<BsonDocument>.Filter.Ne("summary", "")
               ),
               Builders<BsonDocument>.Filter.Exists("embeddings", false)
           );
           return Collection.Find(filter).Limit(250).ToList();
       }

       public async Task<string> UpdateDocuments(Dictionary<string, float[]> embeddings)
       {
           var listWrites = new List<WriteModel<BsonDocument>>();
           foreach (var kvp in embeddings)
           {
               var filterForUpdate = Builders<BsonDocument>.Filter.Eq("_id", kvp.Key);
               var updateDefinition = Builders<BsonDocument>.Update.Set("embeddings", kvp.Value);
               listWrites.Add(new UpdateOneModel<BsonDocument>(filterForUpdate, updateDefinition));
           }

           try
           {
               var result = await Collection.BulkWriteAsync(listWrites);
               listWrites.Clear();
               return $"{result.ModifiedCount} documents updated successfully.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public string CreateVectorIndex()
       {
           try
           {
               var searchIndexView = Collection.SearchIndexes;
               var name = "vector_index";

               var definition = new BsonDocument
               {
                   {
                       "fields", new BsonArray
                       {
                           new BsonDocument
                           {
                               { "type", "vector" },
                               { "path", "embeddings" },
                               { "numDimensions", 768 },
                               { "similarity", "cosine" }
                           }
                       }
                   }
               };

               var model = new CreateSearchIndexModel(name, SearchIndexType.VectorSearch, definition);
               searchIndexView.CreateOne(model);
               Console.WriteLine($"New search index named {name} is building.");

               // Polling for index status
               Console.WriteLine("Polling to check if the index is ready. This may take up to a minute.");
               bool queryable = false;
               while (!queryable)
               {
                   var indexes = searchIndexView.List();
                   foreach (var index in indexes.ToEnumerable())
                   {
                       if (index["name"] == name)
                       {
                           queryable = index["queryable"].AsBoolean;
                       }
                   }
                   if (!queryable)
                   {
                       Thread.Sleep(5000);
                   }
               }
               return $"{name} is ready for querying.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public List<BsonDocument>? PerformVectorQuery(float[] vector)
       {
           var vectorSearchStage = new BsonDocument
           {
               {
                   "$vectorSearch",
                   new BsonDocument
                   {
                       { "index", "vector_index" },
                       { "path", "embeddings" },
                       { "queryVector", new BsonArray(vector) },
                       { "exact", true },
                       { "limit", 5 }
                   }
               }
           };
           var projectStage = new BsonDocument
           {
               {
                   "$project",
                   new BsonDocument
                   {
                       { "_id", 0 },
                       { "summary", 1 },
                       { "listing_url", 1 },
                       {
                           "score",
                           new BsonDocument
                           {
                               { "$meta", "vectorSearchScore" }
                           }
                       }
                   }
               }
           };
           var pipeline = new[] { vectorSearchStage, projectStage };
           return Collection.Aggregate<BsonDocument>(pipeline).ToList();
       }
   }

   ```

   This class also defines the `CreateVectorIndex()` and `PerformVectorQuery()` methods that you use in later steps.

   Generating embeddings takes time and computational resources. In this example, you generate embeddings for only 250 documents from the collection, which should take less than a few minutes. If you want to change the number of documents you're generating embeddings for:

   - Change the number of documents: Adjust the `.Limit(250)` number in the `Find()` call in `GetDocuments()`.

   - Generate embeddings for all documents: Omit the `.Limit(250)` entirely from the `Find()` call in `GetDocuments()`.

   Create another file called `EmbeddingGenerator.cs` and paste the following code into it:

   ```csharp
   namespace MyCompany.RAG.Local;

   public class EmbeddingGenerator
   {
       private readonly MongoDBDataService _dataService = new();
       private readonly OllamaAIService _ollamaAiService = new();

       public async Task<string> GenerateEmbeddings()
       {
           // Retrieve documents from MongoDB
           var documents = _dataService.GetDocuments();
           if (documents != null)
           {
               Console.WriteLine("Generating embeddings.");
               Dictionary<string, float[]> embeddings = new Dictionary<string, float[]>();
               foreach (var document in documents)
               {
                   try
                   {
                       var id = document.GetValue("_id").ToString();
                       var summary = document.GetValue("summary").ToString();
                       if (id != null && summary != null)
                       {
                           // Use Ollama to generate vector embeddings for each
                           // document's "summary" field
                           var embedding = await _ollamaAiService.GetEmbedding(summary);
                           embeddings.Add(id, embedding);
                       }
                   }
                   catch (Exception e)
                   {
                       return $"Error creating embeddings for summaries: {e.Message}";
                   }
               }
               // Add a new field to the MongoDB documents with the vector embedding
               var result = await _dataService.UpdateDocuments(embeddings);
               return result;
           }
           else
           {
               return "No documents found";
           }
       }
   }

   ```

   This code contains the logic to:

   - Get documents from the database.

   - Use the embedding model to generate vector embeddings for the `summary` field of each document.

   - Update the documents with the new embeddings.

   Paste the following code into `Program.cs`:

   ```csharp
   using MyCompany.RAG.Local;

   var embeddingGenerator = new EmbeddingGenerator();
   var result = await embeddingGenerator.GenerateEmbeddings();
   Console.WriteLine(result);

   ```

   Compile and run your project to generate embeddings:

   ```shell
   dotnet run MyCompany.RAG.Local.csproj
   ```

   **Output:**

   ```console
   Generating embeddings.
   250 documents updated successfully.
   ```

1) Download the local embedding model.

   This example uses the [nomic-embed-text](https://ollama.com/library/nomic-embed-text) model from Ollama.

   Run the following command to pull the embedding model:

   ```console
   ollama pull nomic-embed-text
   ```

2) Generate embeddings.

   To encapsulate the logic for each piece of the implementation, create a few classes to coordinate and manage the services.

   Create a file called `OllamaAIService.cs`, and paste the following code into it:

   ```csharp
   using Microsoft.Extensions.AI;

   namespace MyCompany.RAG.Local;

   public class OllamaAIService
   {
       private static readonly Uri OllamaUri = new("http://localhost:11434/");
       private static readonly string EmbeddingModelName = "nomic-embed-text";
       private static readonly OllamaEmbeddingGenerator EmbeddingGenerator = new OllamaEmbeddingGenerator(OllamaUri, EmbeddingModelName);
       private static readonly string ChatModelName = "mistral";
       private static readonly OllamaChatClient ChatClient = new OllamaChatClient(OllamaUri, ChatModelName);

       public async Task<float[]> GetEmbedding(string text)
       {
           var embedding = await EmbeddingGenerator.GenerateVectorAsync(text);
           return embedding.ToArray();
       }

       public async Task<string> SummarizeAnswer(string context)
       {
           string question = "Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.";

           string prompt = $"""
                            Use the following pieces of context to answer the question at the end.
                            Context: {context}
                            Question: {question}
                            """;

           ChatResponse response = await ChatClient.GetResponseAsync(prompt, new ChatOptions { MaxOutputTokens = 400 });
           return response.Text;
       }
   }

   ```

   This class also defines the chat model and the `SummarizeAnswer()` method that you use later to answer questions on your data.

   Create another file called `MongoDBDataService.cs` and paste the following code into it:

   ```csharp
   using MongoDB.Bson;
   using MongoDB.Driver;

   namespace MyCompany.RAG.Local;

   public class MongoDBDataService
   {
       private static readonly string? ConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
       private static readonly MongoClient Client = new MongoClient(ConnectionString);
       private static readonly IMongoDatabase Database = Client.GetDatabase("sample_airbnb");
       private static readonly IMongoCollection<BsonDocument> Collection = Database.GetCollection<BsonDocument>("listingsAndReviews");

       public List<BsonDocument>? GetDocuments()
       {
           var filter = Builders<BsonDocument>.Filter.And(
               Builders<BsonDocument>.Filter.And(
                   Builders<BsonDocument>.Filter.Exists("summary", true),
                   Builders<BsonDocument>.Filter.Ne("summary", "")
               ),
               Builders<BsonDocument>.Filter.Exists("embeddings", false)
           );
           return Collection.Find(filter).Limit(250).ToList();
       }

       public async Task<string> UpdateDocuments(Dictionary<string, float[]> embeddings)
       {
           var listWrites = new List<WriteModel<BsonDocument>>();
           foreach (var kvp in embeddings)
           {
               var filterForUpdate = Builders<BsonDocument>.Filter.Eq("_id", kvp.Key);
               var updateDefinition = Builders<BsonDocument>.Update.Set("embeddings", kvp.Value);
               listWrites.Add(new UpdateOneModel<BsonDocument>(filterForUpdate, updateDefinition));
           }

           try
           {
               var result = await Collection.BulkWriteAsync(listWrites);
               listWrites.Clear();
               return $"{result.ModifiedCount} documents updated successfully.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public string CreateVectorIndex()
       {
           try
           {
               var searchIndexView = Collection.SearchIndexes;
               var name = "vector_index";

               var definition = new BsonDocument
               {
                   {
                       "fields", new BsonArray
                       {
                           new BsonDocument
                           {
                               { "type", "vector" },
                               { "path", "embeddings" },
                               { "numDimensions", 768 },
                               { "similarity", "cosine" }
                           }
                       }
                   }
               };

               var model = new CreateSearchIndexModel(name, SearchIndexType.VectorSearch, definition);
               searchIndexView.CreateOne(model);
               Console.WriteLine($"New search index named {name} is building.");

               // Polling for index status
               Console.WriteLine("Polling to check if the index is ready. This may take up to a minute.");
               bool queryable = false;
               while (!queryable)
               {
                   var indexes = searchIndexView.List();
                   foreach (var index in indexes.ToEnumerable())
                   {
                       if (index["name"] == name)
                       {
                           queryable = index["queryable"].AsBoolean;
                       }
                   }
                   if (!queryable)
                   {
                       Thread.Sleep(5000);
                   }
               }
               return $"{name} is ready for querying.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public List<BsonDocument>? PerformVectorQuery(float[] vector)
       {
           var vectorSearchStage = new BsonDocument
           {
               {
                   "$vectorSearch",
                   new BsonDocument
                   {
                       { "index", "vector_index" },
                       { "path", "embeddings" },
                       { "queryVector", new BsonArray(vector) },
                       { "exact", true },
                       { "limit", 5 }
                   }
               }
           };
           var projectStage = new BsonDocument
           {
               {
                   "$project",
                   new BsonDocument
                   {
                       { "_id", 0 },
                       { "summary", 1 },
                       { "listing_url", 1 },
                       {
                           "score",
                           new BsonDocument
                           {
                               { "$meta", "vectorSearchScore" }
                           }
                       }
                   }
               }
           };
           var pipeline = new[] { vectorSearchStage, projectStage };
           return Collection.Aggregate<BsonDocument>(pipeline).ToList();
       }
   }

   ```

   This class also defines the `CreateVectorIndex()` and `PerformVectorQuery()` methods that you use in later steps.

   Generating embeddings takes time and computational resources. In this example, you generate embeddings for only 250 documents from the collection, which should take less than a few minutes. If you want to change the number of documents you're generating embeddings for:

   - Change the number of documents: Adjust the `.Limit(250)` number in the `Find()` call in `GetDocuments()`.

   - Generate embeddings for all documents: Omit the `.Limit(250)` entirely from the `Find()` call in `GetDocuments()`.

   Create another file called `EmbeddingGenerator.cs` and paste the following code into it:

   ```csharp
   namespace MyCompany.RAG.Local;

   public class EmbeddingGenerator
   {
       private readonly MongoDBDataService _dataService = new();
       private readonly OllamaAIService _ollamaAiService = new();

       public async Task<string> GenerateEmbeddings()
       {
           // Retrieve documents from MongoDB
           var documents = _dataService.GetDocuments();
           if (documents != null)
           {
               Console.WriteLine("Generating embeddings.");
               Dictionary<string, float[]> embeddings = new Dictionary<string, float[]>();
               foreach (var document in documents)
               {
                   try
                   {
                       var id = document.GetValue("_id").ToString();
                       var summary = document.GetValue("summary").ToString();
                       if (id != null && summary != null)
                       {
                           // Use Ollama to generate vector embeddings for each
                           // document's "summary" field
                           var embedding = await _ollamaAiService.GetEmbedding(summary);
                           embeddings.Add(id, embedding);
                       }
                   }
                   catch (Exception e)
                   {
                       return $"Error creating embeddings for summaries: {e.Message}";
                   }
               }
               // Add a new field to the MongoDB documents with the vector embedding
               var result = await _dataService.UpdateDocuments(embeddings);
               return result;
           }
           else
           {
               return "No documents found";
           }
       }
   }

   ```

   This code contains the logic to:

   - Get documents from the database.

   - Use the embedding model to generate vector embeddings for the `summary` field of each document.

   - Update the documents with the new embeddings.

   Paste the following code into `Program.cs`:

   ```csharp
   using MyCompany.RAG.Local;

   var embeddingGenerator = new EmbeddingGenerator();
   var result = await embeddingGenerator.GenerateEmbeddings();
   Console.WriteLine(result);

   ```

   Compile and run your project to generate embeddings:

   ```shell
   dotnet run MyCompany.RAG.Local.csproj
   ```

   **Output:**

   ```console
   Generating embeddings.
   250 documents updated successfully.
   ```

1. Download the local embedding model.

   This example uses the [nomic-embed-text](https://ollama.com/library/nomic-embed-text) model from Ollama.

   Run the following command to pull the embedding model:

   ```console
   ollama pull nomic-embed-text
   ```

2. Generate embeddings.

   Create a `common` directory to store code that you'll reuse in multiple steps.

   ```console
   mkdir common && cd common
   ```

   Create a file called `get-embeddings.go`, and paste the following code into it:

   ```go
   package common

   import (
   	"context"
   	"log"

   	"github.com/tmc/langchaingo/llms/ollama"
   )

   func GetEmbeddings(documents []string) [][]float32 {
   	llm, err := ollama.New(ollama.WithModel("nomic-embed-text"))
   	if err != nil {
   		log.Fatalf("failed to connect to ollama: %v", err)
   	}

   	ctx := context.Background()
   	embs, err := llm.CreateEmbedding(ctx, documents)
   	if err != nil {
   		log.Fatalf("failed to create ollama embedding: %v", err)
   	}

   	return embs
   }


   ```

   To simplify marshalling and unmarshalling documents in this collection to and from BSON, create a file called `models.go` and paste the following code into it:

   ```go
   package common

   import (
   	"time"

   	"go.mongodb.org/mongo-driver/v2/bson"
   )

   type Image struct {
   	ThumbnailURL string `bson:"thumbnail_url"`
   	MediumURL    string `bson:"medium_url"`
   	PictureURL   string `bson:"picture_url"`
   	XLPictureURL string `bson:"xl_picture_url"`
   }

   type Host struct {
   	ID                 string   `bson:"host_id"`
   	URL                string   `bson:"host_url"`
   	Name               string   `bson:"host_name"`
   	Location           string   `bson:"host_location"`
   	About              string   `bson:"host_about"`
   	ThumbnailURL       string   `bson:"host_thumbnail_url"`
   	PictureURL         string   `bson:"host_picture_url"`
   	Neighborhood       string   `bson:"host_neighborhood"`
   	IsSuperhost        bool     `bson:"host_is_superhost"`
   	HasProfilePic      bool     `bson:"host_has_profile_pic"`
   	IdentityVerified   bool     `bson:"host_identity_verified"`
   	ListingsCount      int32    `bson:"host_listings_count"`
   	TotalListingsCount int32    `bson:"host_total_listings_count"`
   	Verifications      []string `bson:"host_verifications"`
   }

   type Location struct {
   	Type            string    `bson:"type"`
   	Coordinates     []float64 `bson:"coordinates"`
   	IsLocationExact bool      `bson:"is_location_exact"`
   }

   type Address struct {
   	Street         string   `bson:"street"`
   	Suburb         string   `bson:"suburb"`
   	GovernmentArea string   `bson:"government_area"`
   	Market         string   `bson:"market"`
   	Country        string   `bson:"Country"`
   	CountryCode    string   `bson:"country_code"`
   	Location       Location `bson:"location"`
   }

   type Availability struct {
   	Thirty         int32 `bson:"availability_30"`
   	Sixty          int32 `bson:"availability_60"`
   	Ninety         int32 `bson:"availability_90"`
   	ThreeSixtyFive int32 `bson:"availability_365"`
   }

   type ReviewScores struct {
   	Accuracy      int32 `bson:"review_scores_accuracy"`
   	Cleanliness   int32 `bson:"review_scores_cleanliness"`
   	CheckIn       int32 `bson:"review_scores_checkin"`
   	Communication int32 `bson:"review_scores_communication"`
   	Location      int32 `bson:"review_scores_location"`
   	Value         int32 `bson:"review_scores_value"`
   	Rating        int32 `bson:"review_scores_rating"`
   }

   type Review struct {
   	ID           string    `bson:"_id"`
   	Date         time.Time `bson:"date,omitempty"`
   	ListingId    string    `bson:"listing_id"`
   	ReviewerId   string    `bson:"reviewer_id"`
   	ReviewerName string    `bson:"reviewer_name"`
   	Comments     string    `bson:"comments"`
   }

   type Listing struct {
   	ID                   string          `bson:"_id"`
   	ListingURL           string          `bson:"listing_url"`
   	Name                 string          `bson:"name"`
   	Summary              string          `bson:"summary"`
   	Space                string          `bson:"space"`
   	Description          string          `bson:"description"`
   	NeighborhoodOverview string          `bson:"neighborhood_overview"`
   	Notes                string          `bson:"notes"`
   	Transit              string          `bson:"transit"`
   	Access               string          `bson:"access"`
   	Interaction          string          `bson:"interaction"`
   	HouseRules           string          `bson:"house_rules"`
   	PropertyType         string          `bson:"property_type"`
   	RoomType             string          `bson:"room_type"`
   	BedType              string          `bson:"bed_type"`
   	MinimumNights        string          `bson:"minimum_nights"`
   	MaximumNights        string          `bson:"maximum_nights"`
   	CancellationPolicy   string          `bson:"cancellation_policy"`
   	LastScraped          time.Time       `bson:"last_scraped,omitempty"`
   	CalendarLastScraped  time.Time       `bson:"calendar_last_scraped,omitempty"`
   	FirstReview          time.Time       `bson:"first_review,omitempty"`
   	LastReview           time.Time       `bson:"last_review,omitempty"`
   	Accommodates         int32           `bson:"accommodates"`
   	Bedrooms             int32           `bson:"bedrooms"`
   	Beds                 int32           `bson:"beds"`
   	NumberOfReviews      int32           `bson:"number_of_reviews"`
   	Bathrooms            bson.Decimal128 `bson:"bathrooms"`
   	Amenities            []string        `bson:"amenities"`
   	Price                bson.Decimal128 `bson:"price"`
   	WeeklyPrice          bson.Decimal128 `bson:"weekly_price"`
   	MonthlyPrice         bson.Decimal128 `bson:"monthly_price"`
   	CleaningFee          bson.Decimal128 `bson:"cleaning_fee"`
   	ExtraPeople          bson.Decimal128 `bson:"extra_people"`
   	GuestsIncluded       bson.Decimal128 `bson:"guests_included"`
   	Image                Image           `bson:"images"`
   	Host                 Host            `bson:"host"`
   	Address              Address         `bson:"address"`
   	Availability         Availability    `bson:"availability"`
   	ReviewScores         ReviewScores    `bson:"review_scores"`
   	Reviews              []Review        `bson:"reviews"`
   	Embeddings           []float32       `bson:"embeddings,omitempty"`
   }


   ```

   Return to the root directory.

   ```text
   cd ../
   ```

   Create another file called `generate-embeddings.go` and paste the following code into it:

   ```go
   package main

   import (
   	"context"
   	"local-rag-mongodb/common" // Module that contains the models and GetEmbeddings function
   	"log"
   	"os"

   	"github.com/joho/godotenv"
   	"go.mongodb.org/mongo-driver/v2/bson"
   	"go.mongodb.org/mongo-driver/v2/mongo"
   	"go.mongodb.org/mongo-driver/v2/mongo/options"
   )

   func main() {
   	ctx := context.Background()

   	if err := godotenv.Load(); err != nil {
   		log.Fatal("no .env file found")
   	}

   	// Connect to your MongoDB cluster
   	uri := os.Getenv("MONGODB_URI")
   	if uri == "" {
   		log.Fatal("set your 'MONGODB_URI' environment variable.")
   	}
   	clientOptions := options.Client().ApplyURI(uri)
   	client, err := mongo.Connect(clientOptions)
   	if err != nil {
   		log.Fatalf("failed to connect to the server: %v", err)
   	}
   	defer func() { _ = client.Disconnect(ctx) }()

   	// Set the namespace
   	coll := client.Database("sample_airbnb").Collection("listingsAndReviews")

   	filter := bson.D{
   		{Key: "$and",
   			Value: bson.A{
   				bson.D{
   					{Key: "$and",
   						Value: bson.A{
   							bson.D{{Key: "summary", Value: bson.D{{Key: "$exists", Value: true}}}},
   							bson.D{{Key: "summary", Value: bson.D{{Key: "$ne", Value: ""}}}},
   						},
   					}},
   				bson.D{{Key: "embeddings", Value: bson.D{{Key: "$exists", Value: false}}}},
   			}},
   	}

   	findOptions := options.Find().SetLimit(250)

   	cursor, err := coll.Find(ctx, filter, findOptions)
   	if err != nil {
   		log.Fatalf("failed to retrieve data from the server: %v", err)
   	}

   	var listings []common.Listing
   	if err = cursor.All(ctx, &listings); err != nil {
   		log.Fatalf("failed to unmarshal retrieved docs to model objects: %v", err)
   	}

   	var summaries []string
   	for _, listing := range listings {
   		summaries = append(summaries, listing.Summary)
   	}

   	log.Println("Generating embeddings.")
   	embeddings := common.GetEmbeddings(summaries)

   	updateDocuments := make([]mongo.WriteModel, len(listings))
   	for i := range updateDocuments {
   		updateDocuments[i] = mongo.NewUpdateOneModel().
   			SetFilter(bson.D{{Key: "_id", Value: listings[i].ID}}).
   			SetUpdate(bson.D{{Key: "$set", Value: bson.D{{Key: "embeddings", Value: embeddings[i]}}}})
   	}

   	bulkWriteOptions := options.BulkWrite().SetOrdered(false)

   	result, err := coll.BulkWrite(ctx, updateDocuments, bulkWriteOptions)
   	if err != nil {
   		log.Fatalf("failed to update documents: %v", err)
   	}

   	log.Printf("%d documents updated successfully.", result.MatchedCount)
   }


   ```

   In this example, we set a limit of 250 documents when generating embeddings. The process to generate embeddings for the more than 5000 documents in the collection is slow. If you want to change the number of documents you're generating embeddings for:

   - Change the number of documents: Adjust the `.SetLimit(250)` number in the `findOptions` variable.

   - Generate embeddings for all documents: Omit the `findOptions` argument from the `Find()` call.

   Run the following command to execute the code:

   ```shell
   go run generate-embeddings.go
   ```

   **Output:**

   ```console
   2025/03/11 11:26:58 Generating embeddings.
   2025/03/11 11:27:00 250 documents updated successfully.
   ```

1) Download the local embedding model.

   This example uses the [nomic-embed-text](https://ollama.com/library/nomic-embed-text) model from Ollama.

   Run the following command to pull the embedding model:

   ```console
   ollama pull nomic-embed-text
   ```

2) Generate embeddings.

   Create a `common` directory to store code that you'll reuse in multiple steps.

   ```console
   mkdir common && cd common
   ```

   Create a file called `get-embeddings.go`, and paste the following code into it:

   ```go
   package common

   import (
   	"context"
   	"log"

   	"github.com/tmc/langchaingo/llms/ollama"
   )

   func GetEmbeddings(documents []string) [][]float32 {
   	llm, err := ollama.New(ollama.WithModel("nomic-embed-text"))
   	if err != nil {
   		log.Fatalf("failed to connect to ollama: %v", err)
   	}

   	ctx := context.Background()
   	embs, err := llm.CreateEmbedding(ctx, documents)
   	if err != nil {
   		log.Fatalf("failed to create ollama embedding: %v", err)
   	}

   	return embs
   }


   ```

   To simplify marshalling and unmarshalling documents in this collection to and from BSON, create a file called `models.go` and paste the following code into it:

   ```go
   package common

   import (
   	"time"

   	"go.mongodb.org/mongo-driver/v2/bson"
   )

   type Image struct {
   	ThumbnailURL string `bson:"thumbnail_url"`
   	MediumURL    string `bson:"medium_url"`
   	PictureURL   string `bson:"picture_url"`
   	XLPictureURL string `bson:"xl_picture_url"`
   }

   type Host struct {
   	ID                 string   `bson:"host_id"`
   	URL                string   `bson:"host_url"`
   	Name               string   `bson:"host_name"`
   	Location           string   `bson:"host_location"`
   	About              string   `bson:"host_about"`
   	ThumbnailURL       string   `bson:"host_thumbnail_url"`
   	PictureURL         string   `bson:"host_picture_url"`
   	Neighborhood       string   `bson:"host_neighborhood"`
   	IsSuperhost        bool     `bson:"host_is_superhost"`
   	HasProfilePic      bool     `bson:"host_has_profile_pic"`
   	IdentityVerified   bool     `bson:"host_identity_verified"`
   	ListingsCount      int32    `bson:"host_listings_count"`
   	TotalListingsCount int32    `bson:"host_total_listings_count"`
   	Verifications      []string `bson:"host_verifications"`
   }

   type Location struct {
   	Type            string    `bson:"type"`
   	Coordinates     []float64 `bson:"coordinates"`
   	IsLocationExact bool      `bson:"is_location_exact"`
   }

   type Address struct {
   	Street         string   `bson:"street"`
   	Suburb         string   `bson:"suburb"`
   	GovernmentArea string   `bson:"government_area"`
   	Market         string   `bson:"market"`
   	Country        string   `bson:"Country"`
   	CountryCode    string   `bson:"country_code"`
   	Location       Location `bson:"location"`
   }

   type Availability struct {
   	Thirty         int32 `bson:"availability_30"`
   	Sixty          int32 `bson:"availability_60"`
   	Ninety         int32 `bson:"availability_90"`
   	ThreeSixtyFive int32 `bson:"availability_365"`
   }

   type ReviewScores struct {
   	Accuracy      int32 `bson:"review_scores_accuracy"`
   	Cleanliness   int32 `bson:"review_scores_cleanliness"`
   	CheckIn       int32 `bson:"review_scores_checkin"`
   	Communication int32 `bson:"review_scores_communication"`
   	Location      int32 `bson:"review_scores_location"`
   	Value         int32 `bson:"review_scores_value"`
   	Rating        int32 `bson:"review_scores_rating"`
   }

   type Review struct {
   	ID           string    `bson:"_id"`
   	Date         time.Time `bson:"date,omitempty"`
   	ListingId    string    `bson:"listing_id"`
   	ReviewerId   string    `bson:"reviewer_id"`
   	ReviewerName string    `bson:"reviewer_name"`
   	Comments     string    `bson:"comments"`
   }

   type Listing struct {
   	ID                   string          `bson:"_id"`
   	ListingURL           string          `bson:"listing_url"`
   	Name                 string          `bson:"name"`
   	Summary              string          `bson:"summary"`
   	Space                string          `bson:"space"`
   	Description          string          `bson:"description"`
   	NeighborhoodOverview string          `bson:"neighborhood_overview"`
   	Notes                string          `bson:"notes"`
   	Transit              string          `bson:"transit"`
   	Access               string          `bson:"access"`
   	Interaction          string          `bson:"interaction"`
   	HouseRules           string          `bson:"house_rules"`
   	PropertyType         string          `bson:"property_type"`
   	RoomType             string          `bson:"room_type"`
   	BedType              string          `bson:"bed_type"`
   	MinimumNights        string          `bson:"minimum_nights"`
   	MaximumNights        string          `bson:"maximum_nights"`
   	CancellationPolicy   string          `bson:"cancellation_policy"`
   	LastScraped          time.Time       `bson:"last_scraped,omitempty"`
   	CalendarLastScraped  time.Time       `bson:"calendar_last_scraped,omitempty"`
   	FirstReview          time.Time       `bson:"first_review,omitempty"`
   	LastReview           time.Time       `bson:"last_review,omitempty"`
   	Accommodates         int32           `bson:"accommodates"`
   	Bedrooms             int32           `bson:"bedrooms"`
   	Beds                 int32           `bson:"beds"`
   	NumberOfReviews      int32           `bson:"number_of_reviews"`
   	Bathrooms            bson.Decimal128 `bson:"bathrooms"`
   	Amenities            []string        `bson:"amenities"`
   	Price                bson.Decimal128 `bson:"price"`
   	WeeklyPrice          bson.Decimal128 `bson:"weekly_price"`
   	MonthlyPrice         bson.Decimal128 `bson:"monthly_price"`
   	CleaningFee          bson.Decimal128 `bson:"cleaning_fee"`
   	ExtraPeople          bson.Decimal128 `bson:"extra_people"`
   	GuestsIncluded       bson.Decimal128 `bson:"guests_included"`
   	Image                Image           `bson:"images"`
   	Host                 Host            `bson:"host"`
   	Address              Address         `bson:"address"`
   	Availability         Availability    `bson:"availability"`
   	ReviewScores         ReviewScores    `bson:"review_scores"`
   	Reviews              []Review        `bson:"reviews"`
   	Embeddings           []float32       `bson:"embeddings,omitempty"`
   }


   ```

   Return to the root directory.

   ```text
   cd ../
   ```

   Create another file called `generate-embeddings.go` and paste the following code into it:

   ```go
   package main

   import (
   	"context"
   	"local-rag-mongodb/common" // Module that contains the models and GetEmbeddings function
   	"log"
   	"os"

   	"github.com/joho/godotenv"
   	"go.mongodb.org/mongo-driver/v2/bson"
   	"go.mongodb.org/mongo-driver/v2/mongo"
   	"go.mongodb.org/mongo-driver/v2/mongo/options"
   )

   func main() {
   	ctx := context.Background()

   	if err := godotenv.Load(); err != nil {
   		log.Fatal("no .env file found")
   	}

   	// Connect to your MongoDB cluster
   	uri := os.Getenv("MONGODB_URI")
   	if uri == "" {
   		log.Fatal("set your 'MONGODB_URI' environment variable.")
   	}
   	clientOptions := options.Client().ApplyURI(uri)
   	client, err := mongo.Connect(clientOptions)
   	if err != nil {
   		log.Fatalf("failed to connect to the server: %v", err)
   	}
   	defer func() { _ = client.Disconnect(ctx) }()

   	// Set the namespace
   	coll := client.Database("sample_airbnb").Collection("listingsAndReviews")

   	filter := bson.D{
   		{Key: "$and",
   			Value: bson.A{
   				bson.D{
   					{Key: "$and",
   						Value: bson.A{
   							bson.D{{Key: "summary", Value: bson.D{{Key: "$exists", Value: true}}}},
   							bson.D{{Key: "summary", Value: bson.D{{Key: "$ne", Value: ""}}}},
   						},
   					}},
   				bson.D{{Key: "embeddings", Value: bson.D{{Key: "$exists", Value: false}}}},
   			}},
   	}

   	findOptions := options.Find().SetLimit(250)

   	cursor, err := coll.Find(ctx, filter, findOptions)
   	if err != nil {
   		log.Fatalf("failed to retrieve data from the server: %v", err)
   	}

   	var listings []common.Listing
   	if err = cursor.All(ctx, &listings); err != nil {
   		log.Fatalf("failed to unmarshal retrieved docs to model objects: %v", err)
   	}

   	var summaries []string
   	for _, listing := range listings {
   		summaries = append(summaries, listing.Summary)
   	}

   	log.Println("Generating embeddings.")
   	embeddings := common.GetEmbeddings(summaries)

   	updateDocuments := make([]mongo.WriteModel, len(listings))
   	for i := range updateDocuments {
   		updateDocuments[i] = mongo.NewUpdateOneModel().
   			SetFilter(bson.D{{Key: "_id", Value: listings[i].ID}}).
   			SetUpdate(bson.D{{Key: "$set", Value: bson.D{{Key: "embeddings", Value: embeddings[i]}}}})
   	}

   	bulkWriteOptions := options.BulkWrite().SetOrdered(false)

   	result, err := coll.BulkWrite(ctx, updateDocuments, bulkWriteOptions)
   	if err != nil {
   		log.Fatalf("failed to update documents: %v", err)
   	}

   	log.Printf("%d documents updated successfully.", result.MatchedCount)
   }


   ```

   In this example, we set a limit of 250 documents when generating embeddings. The process to generate embeddings for the more than 5000 documents in the collection is slow. If you want to change the number of documents you're generating embeddings for:

   - Change the number of documents: Adjust the `.SetLimit(250)` number in the `findOptions` variable.

   - Generate embeddings for all documents: Omit the `findOptions` argument from the `Find()` call.

   Run the following command to execute the code:

   ```shell
   go run generate-embeddings.go
   ```

   **Output:**

   ```console
   2025/03/11 11:26:58 Generating embeddings.
   2025/03/11 11:27:00 250 documents updated successfully.
   ```

1. Download the local embedding model.

   Run the following command to pull the [nomic-embed-text](https://ollama.com/library/nomic-embed-text) model from Ollama:

   ```shell
   ollama pull nomic-embed-text
   ```

2. Define your model and method to generate vector embeddings.

   Create a file called `OllamaModels.java` and paste the following code.

   This code defines the local Ollama embedding and chat models that you'll use in your project. We'll work with the chat model in a later step. You can adapt or create additional models as needed for your preferred setup.

   This code also defines two methods to generate embeddings for a given input using the embedding model that you downloaded previously:

   - **Multiple Inputs**: The `getEmbeddings()` method accepts an array of text inputs (`List<String>`), allowing you to create multiple embeddings in a single API call. The method converts the API-provided arrays of floats to BSON arrays of doubles for storing in your Atlas cluster.

   - **Single Input**: The `getEmbedding()` method accepts a single `String`, which represents a query you want to make against your vector data. The method converts the API-provided array of floats to a BSON array of doubles to use when querying your collection.

   ```java
   import static java.time.Duration.ofSeconds;

   import dev.langchain4j.data.embedding.Embedding;
   import dev.langchain4j.data.segment.TextSegment;
   import dev.langchain4j.model.ollama.OllamaChatModel;
   import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
   import dev.langchain4j.model.output.Response;
   import java.util.List;
   import org.bson.BsonArray;
   import org.bson.BsonDouble;

   public class OllamaModels {

       private static final String host = "http://localhost:11434";
       private static OllamaEmbeddingModel embeddingModel;
       private static OllamaChatModel chatModel;

       /**
        * Returns the Ollama embedding model used by the getEmbeddings() and getEmbedding() methods
        * to generate vector embeddings.
        */
       public static OllamaEmbeddingModel getEmbeddingModel() {
           if (embeddingModel == null) {
               embeddingModel = OllamaEmbeddingModel.builder()
                       .timeout(ofSeconds(10))
                       .modelName("nomic-embed-text")
                       .baseUrl(host)
                       .build();
           }
           return embeddingModel;
       }

       /**
        * Returns the Ollama chat model interface used by the createPrompt() method
        * to process queries and generate responses.
        */
       public static OllamaChatModel getChatModel() {
           if (chatModel == null) {
               chatModel = OllamaChatModel.builder()
                       .timeout(ofSeconds(25))
                       .modelName("mistral")
                       .baseUrl(host)
                       .build();
           }
           return chatModel;
       }

       /**
        * Takes an array of strings and returns a collection of BSON array embeddings
        * to store in the database.
        */
       public static List<BsonArray> getEmbeddings(List<String> texts) {

           List<TextSegment> textSegments =
                   texts.stream().map(TextSegment::from).toList();

           Response<List<Embedding>> response = getEmbeddingModel().embedAll(textSegments);
           return response.content().stream()
                   .map(e -> new BsonArray(
                           e.vectorAsList().stream().map(BsonDouble::new).toList()))
                   .toList();
       }

       /**
        * Takes a single string and returns a BSON array embedding to
        * use in a vector query.
        */
       public static BsonArray getEmbedding(String text) {
           Response<Embedding> response = getEmbeddingModel().embed(text);
           return new BsonArray(
                   response.content().vectorAsList().stream().map(BsonDouble::new).toList());
       }
   }

   ```

3. Write a script that generates embeddings from the sample data.

   Create a file named `EmbeddingGenerator.java` and paste the following code.

   This code uses the `getEmbeddings()` method and the MongoDB [Java Sync Driver](https://www.mongodb.com/docs/drivers/java/sync/) to do the following:

   Connect to your cluster.

   Get a subset of documents from the `sample_airbnb.listingsAndReviews` collection that have a non-empty `summary` field.

   **Note:**

   For demonstration purposes, we set a `limit` of 250 documents to reduce the processing time. You can adjust or remove this limit as needed to better suit your use case.

   Generate an embedding from each document's `summary` field using the `getEmbeddings()` method that you defined previously.

   Update each document with a new `embedding` field that contains the corresponding embedding value.

   ```java
   import com.mongodb.MongoException;
   import com.mongodb.bulk.BulkWriteResult;
   import com.mongodb.client.MongoClient;
   import com.mongodb.client.MongoClients;
   import com.mongodb.client.MongoCollection;
   import com.mongodb.client.MongoCursor;
   import com.mongodb.client.MongoDatabase;
   import com.mongodb.client.model.BulkWriteOptions;
   import com.mongodb.client.model.Filters;
   import com.mongodb.client.model.Projections;
   import com.mongodb.client.model.UpdateOneModel;
   import com.mongodb.client.model.Updates;
   import com.mongodb.client.model.WriteModel;
   import java.util.ArrayList;
   import java.util.List;
   import org.bson.BsonArray;
   import org.bson.Document;
   import org.bson.conversions.Bson;

   public class EmbeddingGenerator {

       public static void main(String[] args) {

           String uri = System.getenv("MONGODB_URI");
           if (uri == null || uri.isEmpty()) {
               throw new RuntimeException("MONGODB_URI env variable is not set or is empty.");
           }

           // establish connection and set namespace
           try (MongoClient mongoClient = MongoClients.create(uri)) {
               MongoDatabase database = mongoClient.getDatabase("sample_airbnb");
               MongoCollection<Document> collection = database.getCollection("listingsAndReviews");

               // define parameters for the find() operation
               // NOTE: this example uses a limit to reduce processing time
               Bson projectionFields = Projections.fields(Projections.include("_id", "summary"));
               Bson filterSummary = Filters.ne("summary", "");
               int limit = 250;

               try (MongoCursor<Document> cursor = collection
                       .find(filterSummary)
                       .projection(projectionFields)
                       .limit(limit)
                       .iterator()) {

                   List<String> summaries = new ArrayList<>();
                   List<String> documentIds = new ArrayList<>();

                   while (cursor.hasNext()) {
                       Document document = cursor.next();
                       String summary = document.getString("summary");
                       String id = document.get("_id").toString();
                       summaries.add(summary);
                       documentIds.add(id);
                   }

                   // generate embeddings for the summary in each document
                   // and add to the document to the 'embeddings' array field
                   System.out.println("Generating embeddings for " + summaries.size() + " documents.");
                   System.out.println("This operation may take up to several minutes.");
                   List<BsonArray> embeddings = OllamaModels.getEmbeddings(summaries);

                   List<WriteModel<Document>> updateDocuments = new ArrayList<>();
                   for (int j = 0; j < summaries.size(); j++) {
                       UpdateOneModel<Document> updateDoc = new UpdateOneModel<>(
                               Filters.eq("_id", documentIds.get(j)),
                               Updates.set("embeddings", embeddings.get(j)));
                       updateDocuments.add(updateDoc);
                   }

                   // bulk write the updated documents to the 'listingsAndReviews' collection
                   int result = performBulkWrite(updateDocuments, collection);
                   System.out.println("Added embeddings successfully to " + result + " documents.");
               }
           } catch (MongoException me) {
               throw new RuntimeException("Failed to connect to MongoDB", me);
           } catch (Exception e) {
               throw new RuntimeException("Operation failed: ", e);
           }
       }

       /**
        * Performs a bulk write operation on the specified collection.
        */
       private static int performBulkWrite(
               List<WriteModel<Document>> updateDocuments, MongoCollection<Document> collection) {

           if (updateDocuments.isEmpty()) {
               return 0;
           }

           BulkWriteResult result;
           try {
               BulkWriteOptions options = new BulkWriteOptions().ordered(false);
               result = collection.bulkWrite(updateDocuments, options);
               return result.getModifiedCount();
           } catch (MongoException me) {
               throw new RuntimeException("Failed to insert documents", me);
           }
       }
   }

   ```

4. Generate embeddings.

   Save and run the file. The output resembles:

   ```shell
   Generating embeddings for 250 documents.
   This operation may take up to several minutes.
   Added embeddings successfully to 250 documents.

   ```

1) Download the local embedding model.

   Run the following command to pull the [nomic-embed-text](https://ollama.com/library/nomic-embed-text) model from Ollama:

   ```shell
   ollama pull nomic-embed-text
   ```

2) Define your model and method to generate vector embeddings.

   Create a file called `OllamaModels.java` and paste the following code.

   This code defines the local Ollama embedding and chat models that you'll use in your project. We'll work with the chat model in a later step. You can adapt or create additional models as needed for your preferred setup.

   This code also defines two methods to generate embeddings for a given input using the embedding model that you downloaded previously:

   - **Multiple Inputs**: The `getEmbeddings()` method accepts an array of text inputs (`List<String>`), allowing you to create multiple embeddings in a single API call. The method converts the API-provided arrays of floats to BSON arrays of doubles for storing in your Atlas cluster.

   - **Single Input**: The `getEmbedding()` method accepts a single `String`, which represents a query you want to make against your vector data. The method converts the API-provided array of floats to a BSON array of doubles to use when querying your collection.

   ```java
   import static java.time.Duration.ofSeconds;

   import dev.langchain4j.data.embedding.Embedding;
   import dev.langchain4j.data.segment.TextSegment;
   import dev.langchain4j.model.ollama.OllamaChatModel;
   import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
   import dev.langchain4j.model.output.Response;
   import java.util.List;
   import org.bson.BsonArray;
   import org.bson.BsonDouble;

   public class OllamaModels {

       private static final String host = "http://localhost:11434";
       private static OllamaEmbeddingModel embeddingModel;
       private static OllamaChatModel chatModel;

       /**
        * Returns the Ollama embedding model used by the getEmbeddings() and getEmbedding() methods
        * to generate vector embeddings.
        */
       public static OllamaEmbeddingModel getEmbeddingModel() {
           if (embeddingModel == null) {
               embeddingModel = OllamaEmbeddingModel.builder()
                       .timeout(ofSeconds(10))
                       .modelName("nomic-embed-text")
                       .baseUrl(host)
                       .build();
           }
           return embeddingModel;
       }

       /**
        * Returns the Ollama chat model interface used by the createPrompt() method
        * to process queries and generate responses.
        */
       public static OllamaChatModel getChatModel() {
           if (chatModel == null) {
               chatModel = OllamaChatModel.builder()
                       .timeout(ofSeconds(25))
                       .modelName("mistral")
                       .baseUrl(host)
                       .build();
           }
           return chatModel;
       }

       /**
        * Takes an array of strings and returns a collection of BSON array embeddings
        * to store in the database.
        */
       public static List<BsonArray> getEmbeddings(List<String> texts) {

           List<TextSegment> textSegments =
                   texts.stream().map(TextSegment::from).toList();

           Response<List<Embedding>> response = getEmbeddingModel().embedAll(textSegments);
           return response.content().stream()
                   .map(e -> new BsonArray(
                           e.vectorAsList().stream().map(BsonDouble::new).toList()))
                   .toList();
       }

       /**
        * Takes a single string and returns a BSON array embedding to
        * use in a vector query.
        */
       public static BsonArray getEmbedding(String text) {
           Response<Embedding> response = getEmbeddingModel().embed(text);
           return new BsonArray(
                   response.content().vectorAsList().stream().map(BsonDouble::new).toList());
       }
   }

   ```

3) Write a script that generates embeddings from the sample data.

   Create a file named `EmbeddingGenerator.java` and paste the following code.

   This code uses the `getEmbeddings()` method and the MongoDB [Java Sync Driver](https://www.mongodb.com/docs/drivers/java/sync/) to do the following:

   Connect to your cluster.

   Get a subset of documents from the `sample_airbnb.listingsAndReviews` collection that have a non-empty `summary` field.

   **Note:**

   For demonstration purposes, we set a `limit` of 250 documents to reduce the processing time. You can adjust or remove this limit as needed to better suit your use case.

   Generate an embedding from each document's `summary` field using the `getEmbeddings()` method that you defined previously.

   Update each document with a new `embedding` field that contains the corresponding embedding value.

   ```java
   import com.mongodb.MongoException;
   import com.mongodb.bulk.BulkWriteResult;
   import com.mongodb.client.MongoClient;
   import com.mongodb.client.MongoClients;
   import com.mongodb.client.MongoCollection;
   import com.mongodb.client.MongoCursor;
   import com.mongodb.client.MongoDatabase;
   import com.mongodb.client.model.BulkWriteOptions;
   import com.mongodb.client.model.Filters;
   import com.mongodb.client.model.Projections;
   import com.mongodb.client.model.UpdateOneModel;
   import com.mongodb.client.model.Updates;
   import com.mongodb.client.model.WriteModel;
   import java.util.ArrayList;
   import java.util.List;
   import org.bson.BsonArray;
   import org.bson.Document;
   import org.bson.conversions.Bson;

   public class EmbeddingGenerator {

       public static void main(String[] args) {

           String uri = System.getenv("MONGODB_URI");
           if (uri == null || uri.isEmpty()) {
               throw new RuntimeException("MONGODB_URI env variable is not set or is empty.");
           }

           // establish connection and set namespace
           try (MongoClient mongoClient = MongoClients.create(uri)) {
               MongoDatabase database = mongoClient.getDatabase("sample_airbnb");
               MongoCollection<Document> collection = database.getCollection("listingsAndReviews");

               // define parameters for the find() operation
               // NOTE: this example uses a limit to reduce processing time
               Bson projectionFields = Projections.fields(Projections.include("_id", "summary"));
               Bson filterSummary = Filters.ne("summary", "");
               int limit = 250;

               try (MongoCursor<Document> cursor = collection
                       .find(filterSummary)
                       .projection(projectionFields)
                       .limit(limit)
                       .iterator()) {

                   List<String> summaries = new ArrayList<>();
                   List<String> documentIds = new ArrayList<>();

                   while (cursor.hasNext()) {
                       Document document = cursor.next();
                       String summary = document.getString("summary");
                       String id = document.get("_id").toString();
                       summaries.add(summary);
                       documentIds.add(id);
                   }

                   // generate embeddings for the summary in each document
                   // and add to the document to the 'embeddings' array field
                   System.out.println("Generating embeddings for " + summaries.size() + " documents.");
                   System.out.println("This operation may take up to several minutes.");
                   List<BsonArray> embeddings = OllamaModels.getEmbeddings(summaries);

                   List<WriteModel<Document>> updateDocuments = new ArrayList<>();
                   for (int j = 0; j < summaries.size(); j++) {
                       UpdateOneModel<Document> updateDoc = new UpdateOneModel<>(
                               Filters.eq("_id", documentIds.get(j)),
                               Updates.set("embeddings", embeddings.get(j)));
                       updateDocuments.add(updateDoc);
                   }

                   // bulk write the updated documents to the 'listingsAndReviews' collection
                   int result = performBulkWrite(updateDocuments, collection);
                   System.out.println("Added embeddings successfully to " + result + " documents.");
               }
           } catch (MongoException me) {
               throw new RuntimeException("Failed to connect to MongoDB", me);
           } catch (Exception e) {
               throw new RuntimeException("Operation failed: ", e);
           }
       }

       /**
        * Performs a bulk write operation on the specified collection.
        */
       private static int performBulkWrite(
               List<WriteModel<Document>> updateDocuments, MongoCollection<Document> collection) {

           if (updateDocuments.isEmpty()) {
               return 0;
           }

           BulkWriteResult result;
           try {
               BulkWriteOptions options = new BulkWriteOptions().ordered(false);
               result = collection.bulkWrite(updateDocuments, options);
               return result.getModifiedCount();
           } catch (MongoException me) {
               throw new RuntimeException("Failed to insert documents", me);
           }
       }
   }

   ```

4) Generate embeddings.

   Save and run the file. The output resembles:

   ```shell
   Generating embeddings for 250 documents.
   This operation may take up to several minutes.
   Added embeddings successfully to 250 documents.

   ```

1. Download the local embedding model.

   This example uses the [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) model from the Hugging Face model hub. The simplest method to download the model files is to clone the repository using Git with Git Large File Storage. Hugging Face requires a [user access token](https://huggingface.co/docs/hub/en/security-tokens) or [Git over SSH](https://huggingface.co/docs/hub/en/security-git-ssh) to authenticate your request to clone the repository.

   ### User Access Token

   ```shell
   git clone https://<your-hugging-face-username>:<your-hugging-face-user-access-token>@huggingface.co/mixedbread-ai/mxbai-embed-large-v1
   ```

   **Tip: Git Large File Storage**

   The Hugging Face model files are large, and require Git Large File Storage ([git-lfs](https://git-lfs.com/)) to clone the repositories. If you see errors related to large file storage, ensure you have installed git-lfs.

2. Get the local path to the model files.

   Get the path to the local model files on your machine. This is the parent directory that contains the git repository you just cloned. If you cloned the model repository inside the project directory you created for this tutorial, the parent directory path should resemble:

   `/Users/<username>/local-rag-mongodb`

   Check the model directory and make sure it contains an `onnx` directory that has a `model_quantized.onnx` file:

   ```shell
   cd mxbai-embed-large-v1/onnx
   ls
   ```

   **Output:**

   ```console
   model.onnx      model_fp16.onnx     model_quantized.onnx
   ```

3. Generate embeddings.

   Navigate back to the `local-rag-mongodb` parent directory.

   Create a file called `get-embeddings.js`, and paste the following code into it:

   ```javascript
   import { env, pipeline } from '@xenova/transformers';

   // Function to generate embeddings for given data
   export async function getEmbedding(data) {
     // Replace this path with the parent directory that contains the model files
     env.localModelPath = '/Users/<username>/local-rag-mongodb/';
     env.allowRemoteModels = false;
     const task = 'feature-extraction';
     const model = 'mxbai-embed-large-v1';
     const embedder = await pipeline(task, model);
     const results = await embedder(data, { pooling: 'mean', normalize: true });
     return Array.from(results.data);
   }

   ```

   Replace the `'/Users/<username>/local-rag-mongodb/'` with the local path from the prior step.

   Create another file called `generate-embeddings.js` and paste the following code into it:

   ```javascript
   import { MongoClient } from 'mongodb';
   import { getEmbedding } from './get-embeddings.js';

   // Connect to your MongoDB cluster
   const client = new MongoClient(process.env.MONGODB_URI);

   try {
     // Connect to your local MongoDB deployment
     await client.connect();
     const db = client.db('sample_airbnb');
     const collection = db.collection('listingsAndReviews');

     const filter = {
       $and: [
         { summary: { $exists: true, $nin: [null, ''] } },
         { embeddings: { $exists: false } },
       ],
     };

     // This is a long-running operation for all docs in the collection,
     // so we limit the docs for this example
     const cursor = collection.find(filter).limit(50);

     console.log('Generating embeddings and updating documents...');

     // Create embeddings from a field in the collection
     const updateDocuments = [];
     for await (const doc of cursor) {
       const embedding = await getEmbedding(doc.summary);

       updateDocuments.push({
         updateOne: {
           filter: { _id: doc._id },
           update: { $set: { embeddings: embedding } },
         },
       });
     }

     // Continue processing documents if an error occurs during an operation
     const options = { ordered: false };

     // Update documents with the new embedding field
     const result = await collection.bulkWrite(updateDocuments, options);
     console.log('Count of documents updated: ' + result.modifiedCount);
   } catch (err) {
     console.log(err.stack);
   } finally {
     await client.close();
   }

   ```

   For a subset of documents in the collection, this code generates an embedding from the document's `summary` field, then updates the document with a new field called `embeddings` that contains the embedding.

   Run the following command to execute the code:

   ```shell
   node --env-file=.env generate-embeddings.js
   ```

   **Output:**

   ```console
   Generating embeddings and updating documents...
   Count of documents updated: 50

   ```

1) Download the local embedding model.

   This example uses the [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) model from the Hugging Face model hub. The simplest method to download the model files is to clone the repository using Git with Git Large File Storage. Hugging Face requires a [user access token](https://huggingface.co/docs/hub/en/security-tokens) or [Git over SSH](https://huggingface.co/docs/hub/en/security-git-ssh) to authenticate your request to clone the repository.

   ### User Access Token

   ```shell
   git clone https://<your-hugging-face-username>:<your-hugging-face-user-access-token>@huggingface.co/mixedbread-ai/mxbai-embed-large-v1
   ```

   **Tip: Git Large File Storage**

   The Hugging Face model files are large, and require Git Large File Storage ([git-lfs](https://git-lfs.com/)) to clone the repositories. If you see errors related to large file storage, ensure you have installed git-lfs.

2) Get the local path to the model files.

   Get the path to the local model files on your machine. This is the parent directory that contains the git repository you just cloned. If you cloned the model repository inside the project directory you created for this tutorial, the parent directory path should resemble:

   `/Users/<username>/local-rag-mongodb`

   Check the model directory and make sure it contains an `onnx` directory that has a `model_quantized.onnx` file:

   ```shell
   cd mxbai-embed-large-v1/onnx
   ls
   ```

   **Output:**

   ```console
   model.onnx      model_fp16.onnx     model_quantized.onnx
   ```

3) Generate embeddings.

   Navigate back to the `local-rag-mongodb` parent directory.

   Create a file called `get-embeddings.js`, and paste the following code into it:

   ```javascript
   import { env, pipeline } from '@xenova/transformers';

   // Function to generate embeddings for given data
   export async function getEmbedding(data) {
     // Replace this path with the parent directory that contains the model files
     env.localModelPath = '/Users/<username>/local-rag-mongodb/';
     env.allowRemoteModels = false;
     const task = 'feature-extraction';
     const model = 'mxbai-embed-large-v1';
     const embedder = await pipeline(task, model);
     const results = await embedder(data, { pooling: 'mean', normalize: true });
     return Array.from(results.data);
   }

   ```

   Replace the `'/Users/<username>/local-rag-mongodb/'` with the local path from the prior step.

   Create another file called `generate-embeddings.js` and paste the following code into it:

   ```javascript
   import { MongoClient } from 'mongodb';
   import { getEmbedding } from './get-embeddings.js';

   // Connect to your MongoDB cluster
   const client = new MongoClient(process.env.MONGODB_URI);

   try {
     // Connect to your local MongoDB deployment
     await client.connect();
     const db = client.db('sample_airbnb');
     const collection = db.collection('listingsAndReviews');

     const filter = {
       $and: [
         { summary: { $exists: true, $nin: [null, ''] } },
         { embeddings: { $exists: false } },
       ],
     };

     // This is a long-running operation for all docs in the collection,
     // so we limit the docs for this example
     const cursor = collection.find(filter).limit(50);

     console.log('Generating embeddings and updating documents...');

     // Create embeddings from a field in the collection
     const updateDocuments = [];
     for await (const doc of cursor) {
       const embedding = await getEmbedding(doc.summary);

       updateDocuments.push({
         updateOne: {
           filter: { _id: doc._id },
           update: { $set: { embeddings: embedding } },
         },
       });
     }

     // Continue processing documents if an error occurs during an operation
     const options = { ordered: false };

     // Update documents with the new embedding field
     const result = await collection.bulkWrite(updateDocuments, options);
     console.log('Count of documents updated: ' + result.modifiedCount);
   } catch (err) {
     console.log(err.stack);
   } finally {
     await client.close();
   }

   ```

   For a subset of documents in the collection, this code generates an embedding from the document's `summary` field, then updates the document with a new field called `embeddings` that contains the embedding.

   Run the following command to execute the code:

   ```shell
   node --env-file=.env generate-embeddings.js
   ```

   **Output:**

   ```console
   Generating embeddings and updating documents...
   Count of documents updated: 50

   ```

1. Paste the following code into your notebook.

   This code performs the following actions:

   - Connects to your cluster and selects the `sample_airbnb.listingsAndReviews` collection.

   - Loads the [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) model from the Hugging Face model hub and saves it locally. To learn more, see [Downloading models.](https://huggingface.co/docs/hub/en/models-downloading)

   - Defines a function that uses the model to generate vector embeddings.

   - For a subset of documents in the collection:

     - Generates an embedding from the document's `summary` field.

     - Updates the document by creating a new field called `embeddings` that contains the embedding.

     ```python
     from pymongo import MongoClient
     from sentence_transformers import SentenceTransformer

     # Connect to your local MongoDB deployment
     client = MongoClient(MONGODB_URI)

     # Select the sample_airbnb.listingsAndReviews collection
     collection = client["sample_airbnb"]["listingsAndReviews"]

     # Load the embedding model (https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1)
     model_path = "<model-path>"
     model = SentenceTransformer("mixedbread-ai/mxbai-embed-large-v1")
     model.save(model_path)
     model = SentenceTransformer(model_path)

     # Define function to generate embeddings
     def get_embedding(text):
         return model.encode(text).tolist()


     # Filters for only documents with a summary field and without an embeddings field
     filter = {
         "$and": [
             {"summary": {"$exists": True, "$nin": [None, ""]}},
             {"embeddings": {"$exists": False}},
         ]
     }

     # Creates embeddings for subset of the collection
     updated_doc_count = 0
     for document in collection.find(filter).limit(50):
         text = document["summary"]
         embedding = get_embedding(text)
         collection.update_one(
             {"_id": document["_id"]},
             {"$set": {"embeddings": embedding}},
             upsert=True,
         )
         updated_doc_count += 1

     print("Documents updated: {}".format(updated_doc_count))

     ```

     **Output:**

     ```console
     Documents updated: 50

     ```

2. Replace `<model-path>`  with the path to your project directory.

   This path should resemble: `/Users/<username>/local-rag-mongodb`

3. Run the code.

1) Paste the following code into your notebook.

   This code performs the following actions:

   - Connects to your cluster and selects the `sample_airbnb.listingsAndReviews` collection.

   - Loads the [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) model from the Hugging Face model hub and saves it locally. To learn more, see [Downloading models.](https://huggingface.co/docs/hub/en/models-downloading)

   - Defines a function that uses the model to generate vector embeddings.

   - For a subset of documents in the collection:

     - Generates an embedding from the document's `summary` field.

     - Updates the document by creating a new field called `embeddings` that contains the embedding.

     ```python
     from pymongo import MongoClient
     from sentence_transformers import SentenceTransformer

     # Connect to your local MongoDB deployment
     client = MongoClient(MONGODB_URI)

     # Select the sample_airbnb.listingsAndReviews collection
     collection = client["sample_airbnb"]["listingsAndReviews"]

     # Load the embedding model (https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1)
     model_path = "<model-path>"
     model = SentenceTransformer("mixedbread-ai/mxbai-embed-large-v1")
     model.save(model_path)
     model = SentenceTransformer(model_path)

     # Define function to generate embeddings
     def get_embedding(text):
         return model.encode(text).tolist()


     # Filters for only documents with a summary field and without an embeddings field
     filter = {
         "$and": [
             {"summary": {"$exists": True, "$nin": [None, ""]}},
             {"embeddings": {"$exists": False}},
         ]
     }

     # Creates embeddings for subset of the collection
     updated_doc_count = 0
     for document in collection.find(filter).limit(50):
         text = document["summary"]
         embedding = get_embedding(text)
         collection.update_one(
             {"_id": document["_id"]},
             {"$set": {"embeddings": embedding}},
             upsert=True,
         )
         updated_doc_count += 1

     print("Documents updated: {}".format(updated_doc_count))

     ```

     **Output:**

     ```console
     Documents updated: 50

     ```

2) Replace `<model-path>`  with the path to your project directory.

   This path should resemble: `/Users/<username>/local-rag-mongodb`

3) Run the code.

This code might take several minutes to run. After it's finished, you can view your vector embeddings by connecting to your local deployment from [`mongosh`](https://www.mongodb.com/docs/mongodb-shell.md#mongodb-binary-bin.mongosh) or your application using your deployment's connection string. Then you can run [read operations](https://www.mongodb.com/docs/manual/crud.md#std-label-crud-read-operations) on the `sample_airbnb.listingsAndReviews` collection.

**Tip:**

You can convert the embeddings in the sample data to BSON (Binary Javascript Object Notation) vectors for efficient storage and ingestion of vectors in Atlas. To learn more, see [how to convert native embeddings to BSON vectors.](https://www.mongodb.com/docs/vector-search/about/vector-quantization.md#std-label-avs-bindata-vector-subtype)

## Create the MongoDB Vector Search Index

To enable vector search on the `sample_airbnb.listingsAndReviews` collection, create a MongoDB Vector Search index.

To create a MongoDB Vector Search index for a collection using the [MongoDB .NET/C# Driver](https://www.mongodb.com/docs/drivers/csharp/current/fundamentals/indexes/) v3.1.0 or later, perform the following steps:

1. Define the MongoDB Vector Search index.

   Add a new `CreateVectorIndex()` method in the file named `MongoDBDataService.cs` to define the search index:

   ```csharp
   using MongoDB.Bson;
   using MongoDB.Driver;

   namespace MyCompany.RAG.Local;

   public class MongoDBDataService
   {
       private static readonly string? ConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
       private static readonly MongoClient Client = new MongoClient(ConnectionString);
       private static readonly IMongoDatabase Database = Client.GetDatabase("sample_airbnb");
       private static readonly IMongoCollection<BsonDocument> Collection = Database.GetCollection<BsonDocument>("listingsAndReviews");

       public List<BsonDocument>? GetDocuments()
       {
           var filter = Builders<BsonDocument>.Filter.And(
               Builders<BsonDocument>.Filter.And(
                   Builders<BsonDocument>.Filter.Exists("summary", true),
                   Builders<BsonDocument>.Filter.Ne("summary", "")
               ),
               Builders<BsonDocument>.Filter.Exists("embeddings", false)
           );
           return Collection.Find(filter).Limit(250).ToList();
       }

       public async Task<string> UpdateDocuments(Dictionary<string, float[]> embeddings)
       {
           var listWrites = new List<WriteModel<BsonDocument>>();
           foreach (var kvp in embeddings)
           {
               var filterForUpdate = Builders<BsonDocument>.Filter.Eq("_id", kvp.Key);
               var updateDefinition = Builders<BsonDocument>.Update.Set("embeddings", kvp.Value);
               listWrites.Add(new UpdateOneModel<BsonDocument>(filterForUpdate, updateDefinition));
           }

           try
           {
               var result = await Collection.BulkWriteAsync(listWrites);
               listWrites.Clear();
               return $"{result.ModifiedCount} documents updated successfully.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public string CreateVectorIndex()
       {
           try
           {
               var searchIndexView = Collection.SearchIndexes;
               var name = "vector_index";

               var definition = new BsonDocument
               {
                   {
                       "fields", new BsonArray
                       {
                           new BsonDocument
                           {
                               { "type", "vector" },
                               { "path", "embeddings" },
                               { "numDimensions", 768 },
                               { "similarity", "cosine" }
                           }
                       }
                   }
               };

               var model = new CreateSearchIndexModel(name, SearchIndexType.VectorSearch, definition);
               searchIndexView.CreateOne(model);
               Console.WriteLine($"New search index named {name} is building.");

               // Polling for index status
               Console.WriteLine("Polling to check if the index is ready. This may take up to a minute.");
               bool queryable = false;
               while (!queryable)
               {
                   var indexes = searchIndexView.List();
                   foreach (var index in indexes.ToEnumerable())
                   {
                       if (index["name"] == name)
                       {
                           queryable = index["queryable"].AsBoolean;
                       }
                   }
                   if (!queryable)
                   {
                       Thread.Sleep(5000);
                   }
               }
               return $"{name} is ready for querying.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public List<BsonDocument>? PerformVectorQuery(float[] vector)
       {
           var vectorSearchStage = new BsonDocument
           {
               {
                   "$vectorSearch",
                   new BsonDocument
                   {
                       { "index", "vector_index" },
                       { "path", "embeddings" },
                       { "queryVector", new BsonArray(vector) },
                       { "exact", true },
                       { "limit", 5 }
                   }
               }
           };
           var projectStage = new BsonDocument
           {
               {
                   "$project",
                   new BsonDocument
                   {
                       { "_id", 0 },
                       { "summary", 1 },
                       { "listing_url", 1 },
                       {
                           "score",
                           new BsonDocument
                           {
                               { "$meta", "vectorSearchScore" }
                           }
                       }
                   }
               }
           };
           var pipeline = new[] { vectorSearchStage, projectStage };
           return Collection.Aggregate<BsonDocument>(pipeline).ToList();
       }
   }

   ```

   This index definition indexes the `embeddings` field in an index of the [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model. The index definition specifies `768` vector dimensions and measures similarity using `cosine`.

2. Update your `Program.cs`.

   Replace the code in your `Program.cs` with the following code to initialize the `DataService` and call the index creation method:

   ```csharp
   using MyCompany.RAG.Local;

   var dataService = new MongoDBDataService();
   var result = dataService.CreateVectorIndex();
   Console.WriteLine(result);
   ```

3. Create the MongoDB Vector Search index.

   Save the file, and then compile and run your project to create the index:

   ```sh
   dotnet run MyCompany.RAG.Local.csproj
   ```

To create a MongoDB Vector Search index for a collection using the [MongoDB Go driver](https://www.mongodb.com/docs/drivers/go/current/indexes/) v2.0 or later, perform the following steps:

1. Define the MongoDB Vector Search index.

   Create a file named `vector-index.go` and paste the following code in the file:

   ```go
   package main

   import (
   	"context"
   	"log"
   	"os"
   	"time"

   	"github.com/joho/godotenv"
   	"go.mongodb.org/mongo-driver/v2/bson"
   	"go.mongodb.org/mongo-driver/v2/mongo"
   	"go.mongodb.org/mongo-driver/v2/mongo/options"
   )

   func main() {
   	ctx := context.Background()

   	if err := godotenv.Load(); err != nil {
   		log.Println("no .env file found")
   	}
   	// Connect to your MongoDB cluster
   	uri := os.Getenv("MONGODB_URI")
   	if uri == "" {
   		log.Fatal("set your 'MONGODB_URI' environment variable.")
   	}
   	clientOptions := options.Client().ApplyURI(uri)
   	client, err := mongo.Connect(clientOptions)
   	if err != nil {
   		log.Fatalf("failed to connect to the server: %v", err)
   	}
   	defer func() { _ = client.Disconnect(ctx) }()

   	// Set the namespace
   	coll := client.Database("sample_airbnb").Collection("listingsAndReviews")
   	indexName := "vector_index"
   	opts := options.SearchIndexes().SetName(indexName).SetType("vectorSearch")

   	type vectorDefinitionField struct {
   		Type          string `bson:"type"`
   		Path          string `bson:"path"`
   		NumDimensions int    `bson:"numDimensions"`
   		Similarity    string `bson:"similarity"`
   	}

   	type vectorDefinition struct {
   		Fields []vectorDefinitionField `bson:"fields"`
   	}

   	indexModel := mongo.SearchIndexModel{
   		Definition: vectorDefinition{
   			Fields: []vectorDefinitionField{{
   				Type:          "vector",
   				Path:          "embeddings",
   				NumDimensions: 768,
   				Similarity:    "cosine"}},
   		},
   		Options: opts,
   	}
   	log.Println("Creating the index...")
   	searchIndexName, err := coll.SearchIndexes().CreateOne(ctx, indexModel)
   	if err != nil {
   		log.Fatalf("failed to create the search index: %v", err)
   	}

   	// Await the creation of the index.
   	log.Println("Polling to confirm successful index creation.")
   	log.Println("NOTE: This may take up to a minute.")
   	searchIndexes := coll.SearchIndexes()
   	var doc bson.Raw
   	for doc == nil {
   		cursor, err := searchIndexes.List(ctx, options.SearchIndexes().SetName(searchIndexName))
   		if err != nil {
   			log.Fatalf("failed to list search indexes: %v", err)
   		}

   		if !cursor.Next(ctx) {
   			break
   		}

   		name := cursor.Current.Lookup("name").StringValue()
   		queryable := cursor.Current.Lookup("queryable").Boolean()
   		if name == searchIndexName && queryable {
   			doc = cursor.Current
   		} else {
   			time.Sleep(5 * time.Second)
   		}
   	}

   	log.Println("Name of Index Created: " + searchIndexName)
   }


   ```

   This index definition indexes the `embeddings` field in an index of the [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model. The index definition specifies `768` vector dimensions and measures similarity using `cosine`.

2. Create the MongoDB Vector Search index.

   Save the file, and then run the following command in your terminal to execute the code:

   ```sh
   go run vector-index.go
   ```

**Note: Programmatic Index Creation**

The MongoDB Go driver supports programmatic MongoDB Vector Search index creation starting in v1.16.0, but the preceding code shows the syntax for the v2.x driver.

To create a MongoDB Vector Search index for a collection using the [MongoDB Java driver](https://www.mongodb.com/docs/drivers/java/sync/current/indexes/) v5.2.0 or later, perform the following steps:

1. Define a method to create the MongoDB Vector Search index.

   Create a file named `VectorIndex.java` and paste the following code.

   This code calls a `createSearchIndexes()` helper method, which takes your `MongoCollection` object and creates a MongoDB Vector Search index on your collection using the following index definition:

   - Index the `embedding` field in a [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) index type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embedding created using the embedding model.

   - Enforce `768` vector dimensions and measure similarity between vectors using `cosine`.

   ```java
   import com.mongodb.MongoException;
   import com.mongodb.client.ListSearchIndexesIterable;
   import com.mongodb.client.MongoClient;
   import com.mongodb.client.MongoClients;
   import com.mongodb.client.MongoCollection;
   import com.mongodb.client.MongoCursor;
   import com.mongodb.client.MongoDatabase;
   import com.mongodb.client.model.SearchIndexModel;
   import com.mongodb.client.model.SearchIndexType;
   import java.util.Collections;
   import java.util.List;
   import org.bson.Document;
   import org.bson.conversions.Bson;

   public class VectorIndex {

       public static void main(String[] args) {

           String uri = System.getenv("MONGODB_URI");
           if (uri == null || uri.isEmpty()) {
               throw new IllegalStateException("MONGODB_URI env variable is not set or is empty.");
           }

           // establish connection and set namespace
           try (MongoClient mongoClient = MongoClients.create(uri)) {
               MongoDatabase database = mongoClient.getDatabase("sample_airbnb");
               MongoCollection<Document> collection = database.getCollection("listingsAndReviews");

               // define the index details for the index model
               String indexName = "vector_index";
               Bson definition = new Document(
                       "fields",
                       Collections.singletonList(new Document("type", "vector")
                               .append("path", "embeddings")
                               .append("numDimensions", 768)
                               .append("similarity", "cosine")));
               SearchIndexModel indexModel = new SearchIndexModel(indexName, definition, SearchIndexType.vectorSearch());

               // create the index using the defined model
               try {
                   List<String> result = collection.createSearchIndexes(Collections.singletonList(indexModel));
                   System.out.println("Successfully created a vector index named: " + result);
               } catch (Exception e) {
                   throw new RuntimeException(e);
               }

               // wait for index to build and become queryable
               System.out.println("Polling to confirm the index has completed building.");
               System.out.println("It may take up to a minute for the index to build before you can query using it.");
               waitForIndexReady(collection, indexName);

           } catch (MongoException me) {
               throw new RuntimeException("Failed to connect to MongoDB ", me);
           } catch (Exception e) {
               throw new RuntimeException("Operation failed: ", e);
           }
       }

       /**
        * Polls the collection to check whether the specified index is ready to query.
        */
       public static void waitForIndexReady(MongoCollection<Document> collection, String indexName)
               throws InterruptedException {
           ListSearchIndexesIterable<Document> searchIndexes = collection.listSearchIndexes();
           while (true) {
               try (MongoCursor<Document> cursor = searchIndexes.iterator()) {
                   if (!cursor.hasNext()) {
                       break;
                   }
                   Document current = cursor.next();
                   String name = current.getString("name");
                   boolean queryable = current.getBoolean("queryable");
                   if (name.equals(indexName) && queryable) {
                       System.out.println(indexName + " index is ready to query");
                       return;
                   } else {
                       Thread.sleep(500);
                   }
               }
           }
       }
   }

   ```

2. Create the MongoDB Vector Search index.

   Save and run the file. The output resembles:

   ```shell
   Successfully created a vector index named: [vector_index]
   Polling to confirm the index has completed building.
   It may take up to a minute for the index to build before you can query using it.
   vector_index index is ready to query

   ```

To create a MongoDB Vector Search index for a collection using the [MongoDB Node driver](https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/) v6.6.0 or later, perform the following steps:

1. Define the MongoDB Vector Search index.

   Create a file named `vector-index.js` and paste the following code in the file:

   ```javascript
   import { MongoClient } from 'mongodb';

   // Connect to your MongoDB cluster
   const client = new MongoClient(process.env.MONGODB_URI);

   try {
     const database = client.db('sample_airbnb');
     const collection = database.collection('listingsAndReviews');

     // Define your Vector Search index
     const index = {
       name: 'vector_index',
       type: 'vectorSearch',
       definition: {
         fields: [
           {
             type: 'vector',
             numDimensions: 1024,
             path: 'embeddings',
             similarity: 'cosine',
           },
         ],
       },
     };

     // Call the method to create the index
     const result = await collection.createSearchIndex(index);
     console.log(result);
   } finally {
     await client.close();
   }

   ```

   This index definition indexes the `embeddings` field in an index of the [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model. The index definition specifies `1024` vector dimensions and measures similarity using `cosine`.

2. Create the MongoDB Vector Search index.

   Save the file, and then run the following command in your terminal to execute the code:

   ```sh
   node --env-file=.env vector-index.js
   ```

To create a MongoDB Vector Search index for a collection using the [PyMongo](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/indexes/atlas-search-index/) driver v4.7 or later, perform the following steps:

You can create the index directly from your application with the PyMongo driver. Paste and run the following code in your notebook:

```python
from pymongo.operations import SearchIndexModel

# Create your index model, then create the search index
search_index_model = SearchIndexModel(
    definition={
        "fields": [
            {
                "type": "vector",
                "numDimensions": 1024,
                "path": "embeddings",
                "similarity": "cosine",
            }
        ]
    },
    name="vector_index",
    type="vectorSearch",
)
collection.create_search_index(model=search_index_model)

```

This index definition indexes the `embeddings` field in an index of the [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model. The index definition specifies `1024` vector dimensions and measures similarity using `cosine`.

To create a MongoDB Vector Search index using the Atlas CLI, perform the following steps:

1. Define the MongoDB Vector Search index.

   Create a file named `vector-index.json` and paste the following index definition in the file:

   ```json
   {
     "database": "sample_airbnb",
     "collectionName": "listingsAndReviews",
     "type": "vectorSearch",
     "name": "vector_index",
       "fields": [
         {
           "type": "vector",
           "path": "embeddings",
           "numDimensions": 768,
           "similarity": "cosine"
         }
      ]
   }
   ```

   This index definition specifies the following:

   - Index the `embeddings` field in a [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) index type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model.

   - Enforce `768` vector dimensions and measure similarity between vectors using `cosine`.

2. Create the MongoDB Vector Search index.

   Save the file in your project directory, and then run the following command in your terminal, replacing `<path-to-file>` with the path to the `vector-index.json` file that you created.

   ```text
   atlas deployments search indexes create --file <path-to-file>
   ```

   For example, your path might resemble: `/Users/<username>/local-rag-mongodb/vector-index.json`.

To create a MongoDB Vector Search index using the Atlas CLI, perform the following steps:

1. Define the MongoDB Vector Search index.

   Create a file named `vector-index.json` and paste the following index definition in the file:

   ```json
   {
     "database": "sample_airbnb",
     "collectionName": "listingsAndReviews",
     "type": "vectorSearch",
     "name": "vector_index",
       "fields": [
         {
           "type": "vector",
           "path": "embeddings",
           "numDimensions": 768,
           "similarity": "cosine"
         }
      ]
   }
   ```

   This index definition specifies the following:

   - Index the `embeddings` field in a [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) index type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model.

   - Enforce `768` vector dimensions and measure similarity between vectors using `cosine`.

2. Create the MongoDB Vector Search index.

   Save the file in your project directory, and then run the following command in your terminal, replacing `<path-to-file>` with the path to the `vector-index.json` file that you created.

   ```text
   atlas deployments search indexes create --file <path-to-file>
   ```

   For example, your path might resemble: `/Users/<username>/local-rag-mongodb/vector-index.json`.

To create a MongoDB Vector Search index using the Atlas CLI, perform the following steps:

1. Define the MongoDB Vector Search index.

   Create a file named `vector-index.json` and paste the following index definition in the file:

   ```json
   {
     "database": "sample_airbnb",
     "collectionName": "listingsAndReviews",
     "type": "vectorSearch",
     "name": "vector_index",
       "fields": [
         {
           "type": "vector",
           "path": "embeddings",
           "numDimensions": 768,
           "similarity": "cosine"
         }
      ]
   }
   ```

   This index definition specifies the following:

   - Index the `embeddings` field in a [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) index type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model.

   - Enforce `768` vector dimensions and measure similarity between vectors using `cosine`.

2. Create the MongoDB Vector Search index.

   Save the file in your project directory, and then run the following command in your terminal, replacing `<path-to-file>` with the path to the `vector-index.json` file that you created.

   ```text
   atlas deployments search indexes create --file <path-to-file>
   ```

   For example, your path might resemble: `/Users/<username>/local-rag-mongodb/vector-index.json`.

To create a MongoDB Vector Search index using the Atlas CLI, perform the following steps:

1. Define the MongoDB Vector Search index.

   Create a file named `vector-index.json` and paste the following index definition in the file:

   ```json
   {
     "database": "sample_airbnb",
     "collectionName": "listingsAndReviews",
     "type": "vectorSearch",
     "name": "vector_index",
       "fields": [
         {
           "type": "vector",
           "path": "embeddings",
           "numDimensions": 768,
           "similarity": "cosine"
         }
      ]
   }
   ```

   This index definition specifies the following:

   - Index the `embeddings` field in a [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) index type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model.

   - Enforce `768` vector dimensions and measure similarity between vectors using `cosine`.

2. Create the MongoDB Vector Search index.

   Save the file in your project directory, and then run the following command in your terminal, replacing `<path-to-file>` with the path to the `vector-index.json` file that you created.

   ```text
   atlas deployments search indexes create --file <path-to-file>
   ```

   For example, your path might resemble: `/Users/<username>/local-rag-mongodb/vector-index.json`.

To create a MongoDB Vector Search index using the Atlas CLI, perform the following steps:

1. Define the MongoDB Vector Search index.

   Create a file named `vector-index.json` and paste the following index definition in the file:

   ```json
   {
     "database": "sample_airbnb",
     "collectionName": "listingsAndReviews",
     "type": "vectorSearch",
     "name": "vector_index",
       "fields": [
         {
           "type": "vector",
           "path": "embeddings",
           "numDimensions": 768,
           "similarity": "cosine"
         }
      ]
   }
   ```

   This index definition specifies the following:

   - Index the `embeddings` field in a [vectorSearch](https://www.mongodb.com/docs/vector-search/indexes/vector-search-type.md#std-label-avs-types-vector-search) index type for the `sample_airbnb.listingsAndReviews` collection. This field contains the embeddings created using the embedding model.

   - Enforce `768` vector dimensions and measure similarity between vectors using `cosine`.

2. Create the MongoDB Vector Search index.

   Save the file in your project directory, and then run the following command in your terminal, replacing `<path-to-file>` with the path to the `vector-index.json` file that you created.

   ```text
   atlas deployments search indexes create --file <path-to-file>
   ```

   For example, your path might resemble: `/Users/<username>/local-rag-mongodb/vector-index.json`.

## Answer Questions with the Local LLM

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and Ollama.

1. Query the database for relevant documents.

   Add a new `PerformVectorQuery()` method in the file named `MongoDBDataService.cs`:

   ```csharp
   using MongoDB.Bson;
   using MongoDB.Driver;

   namespace MyCompany.RAG.Local;

   public class MongoDBDataService
   {
       private static readonly string? ConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
       private static readonly MongoClient Client = new MongoClient(ConnectionString);
       private static readonly IMongoDatabase Database = Client.GetDatabase("sample_airbnb");
       private static readonly IMongoCollection<BsonDocument> Collection = Database.GetCollection<BsonDocument>("listingsAndReviews");

       public List<BsonDocument>? GetDocuments()
       {
           var filter = Builders<BsonDocument>.Filter.And(
               Builders<BsonDocument>.Filter.And(
                   Builders<BsonDocument>.Filter.Exists("summary", true),
                   Builders<BsonDocument>.Filter.Ne("summary", "")
               ),
               Builders<BsonDocument>.Filter.Exists("embeddings", false)
           );
           return Collection.Find(filter).Limit(250).ToList();
       }

       public async Task<string> UpdateDocuments(Dictionary<string, float[]> embeddings)
       {
           var listWrites = new List<WriteModel<BsonDocument>>();
           foreach (var kvp in embeddings)
           {
               var filterForUpdate = Builders<BsonDocument>.Filter.Eq("_id", kvp.Key);
               var updateDefinition = Builders<BsonDocument>.Update.Set("embeddings", kvp.Value);
               listWrites.Add(new UpdateOneModel<BsonDocument>(filterForUpdate, updateDefinition));
           }

           try
           {
               var result = await Collection.BulkWriteAsync(listWrites);
               listWrites.Clear();
               return $"{result.ModifiedCount} documents updated successfully.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public string CreateVectorIndex()
       {
           try
           {
               var searchIndexView = Collection.SearchIndexes;
               var name = "vector_index";

               var definition = new BsonDocument
               {
                   {
                       "fields", new BsonArray
                       {
                           new BsonDocument
                           {
                               { "type", "vector" },
                               { "path", "embeddings" },
                               { "numDimensions", 768 },
                               { "similarity", "cosine" }
                           }
                       }
                   }
               };

               var model = new CreateSearchIndexModel(name, SearchIndexType.VectorSearch, definition);
               searchIndexView.CreateOne(model);
               Console.WriteLine($"New search index named {name} is building.");

               // Polling for index status
               Console.WriteLine("Polling to check if the index is ready. This may take up to a minute.");
               bool queryable = false;
               while (!queryable)
               {
                   var indexes = searchIndexView.List();
                   foreach (var index in indexes.ToEnumerable())
                   {
                       if (index["name"] == name)
                       {
                           queryable = index["queryable"].AsBoolean;
                       }
                   }
                   if (!queryable)
                   {
                       Thread.Sleep(5000);
                   }
               }
               return $"{name} is ready for querying.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public List<BsonDocument>? PerformVectorQuery(float[] vector)
       {
           var vectorSearchStage = new BsonDocument
           {
               {
                   "$vectorSearch",
                   new BsonDocument
                   {
                       { "index", "vector_index" },
                       { "path", "embeddings" },
                       { "queryVector", new BsonArray(vector) },
                       { "exact", true },
                       { "limit", 5 }
                   }
               }
           };
           var projectStage = new BsonDocument
           {
               {
                   "$project",
                   new BsonDocument
                   {
                       { "_id", 0 },
                       { "summary", 1 },
                       { "listing_url", 1 },
                       {
                           "score",
                           new BsonDocument
                           {
                               { "$meta", "vectorSearchScore" }
                           }
                       }
                   }
               }
           };
           var pipeline = new[] { vectorSearchStage, projectStage };
           return Collection.Aggregate<BsonDocument>(pipeline).ToList();
       }
   }

   ```

   This code performs a vector query on your cluster.

   Create another file called `PerformTestQuery.cs` and paste the following code into it:

   ```csharp
   namespace MyCompany.RAG.Local;

   public class PerformTestQuery
   {
       private readonly MongoDBDataService _dataService = new();
       private readonly OllamaAIService _ollamaAiService = new();

       public async Task<string> GetQueryResults(string question)
       {
           // Get the vector embedding for the query
           var query = question;
           var queryEmbedding = await _ollamaAiService.GetEmbedding(query);
           // Query the vector database for applicable query results
           var matchingDocuments = _dataService.PerformVectorQuery(queryEmbedding);
           // Construct a string from the query results for performing QA with the LLM
           var sb = new System.Text.StringBuilder();
           if (matchingDocuments != null)
           {
               foreach (var doc in matchingDocuments)
               {
                   sb.AppendLine($"Summary: {doc.GetValue("summary").ToString()}");
                   sb.AppendLine($"Listing URL: {doc.GetValue("listing_url").ToString()}");
               }
           }
           else
           {
               return "No matching documents found.";
           }
           return sb.ToString();
       }
   }

   ```

   This code contains the logic to:

   - Define an embedding for the query.

   - Retrieve matching documents from the `MongoDBDataService`.

   - Construct a string containing the "Summary" and "Listing URL" from each document to pass on to the LLM for summarizing.

   Run a test query to confirm you're getting the expected results.

   Replace the code in `Program.cs` with the following code:

   ```csharp
   using MyCompany.RAG.Local;

   var query = "beach house";
   var queryCoordinator = new PerformTestQuery();
   var result = await queryCoordinator.GetQueryResults(query);
   Console.WriteLine(result);

   ```

   Save the file, and then compile and run your project to test that you get the expected query results:

   ```shell
   dotnet run MyCompany.RAG.Local.csproj
   ```

   **Output:**

   ```text
   Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/11553333
   Summary: This peaceful house in North Bondi is 300m to the beach and a minute's walk to cafes and bars. With 3 bedrooms, (can sleep up to 8) it is perfect for families, friends and pets. The kitchen was recently renovated and a new lounge and chairs installed. The house has a peaceful, airy, laidback vibe  - a perfect beach retreat. Longer-term bookings encouraged. Parking for one car. A parking permit for a second car can also be obtained on request.
   Listing URL: https://www.airbnb.com/rooms/10423504
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10488837
   Summary: 4 Bedroom Country Beach House w/ option to add a separate studio unit- total of 5 bedrooms/2.5 baths at an additional cost.  27 girl steps to white sand beach & infamous Alligator Pond. Private road, NO highway to cross! Safe beach for children & seniors. Convenient! For pricing to add on additional Studio unit, click on our profile pic and input your dates for quote and details!
   Listing URL: https://www.airbnb.com/rooms/12906000
   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10317142

   ```

2. Download the local LLM model.

   Run the following command to pull the generative model:

   ```console
   ollama pull mistral
   ```

3. Answer questions on your data.

   Add some new static members to your `OllamaAIService.cs` class, for use in a new `SummarizeAnswer` async Task:

   ```csharp
   using Microsoft.Extensions.AI;

   namespace MyCompany.RAG.Local;

   public class OllamaAIService
   {
       private static readonly Uri OllamaUri = new("http://localhost:11434/");
       private static readonly string EmbeddingModelName = "nomic-embed-text";
       private static readonly OllamaEmbeddingGenerator EmbeddingGenerator = new OllamaEmbeddingGenerator(OllamaUri, EmbeddingModelName);
       private static readonly string ChatModelName = "mistral";
       private static readonly OllamaChatClient ChatClient = new OllamaChatClient(OllamaUri, ChatModelName);

       public async Task<float[]> GetEmbedding(string text)
       {
           var embedding = await EmbeddingGenerator.GenerateVectorAsync(text);
           return embedding.ToArray();
       }

       public async Task<string> SummarizeAnswer(string context)
       {
           string question = "Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.";

           string prompt = $"""
                            Use the following pieces of context to answer the question at the end.
                            Context: {context}
                            Question: {question}
                            """;

           ChatResponse response = await ChatClient.GetResponseAsync(prompt, new ChatOptions { MaxOutputTokens = 400 });
           return response.Text;
       }
   }

   ```

   This prompts the LLM and returns the response. The generated response might vary.

   Define a new `PerformQuestionAnswer` class to:

   - Define an embedding for the query.

   - Retrieve matching documents from the `MongoDBDataService`.

   - Use the LLM to summarize the response.

   ```csharp
   namespace MyCompany.RAG.Local;

   public class PerformQuestionAnswer
   {
       private readonly MongoDBDataService _dataService = new();
       private readonly OllamaAIService _ollamaAiService = new();

       public async Task<string> SummarizeResults(string question)
       {
           // Get the vector embedding for the query
           var query = question;
           var queryEmbedding = await _ollamaAiService.GetEmbedding(query);
           // Query the vector database for applicable query results
           var matchingDocuments = _dataService.PerformVectorQuery(queryEmbedding);
           // Construct a string from the query results for performing QA with the LLM
           var sb = new System.Text.StringBuilder();
           if (matchingDocuments != null)
           {
               foreach (var doc in matchingDocuments)
               {
                   sb.AppendLine($"Summary: {doc.GetValue("summary").ToString()}");
                   sb.AppendLine($"Listing URL: {doc.GetValue("listing_url").ToString()}");
               }
           }
           else
           {
               return "No matching documents found.";
           }
           return await _ollamaAiService.SummarizeAnswer(sb.ToString());
       }
   }

   ```

   Replace the contents of `Program.cs` with a new block to perform the task:

   ```csharp
   using MyCompany.RAG.Local;

   var qaTaskCoordinator = new PerformQuestionAnswer();
   const string query = "beach house";
   var results = await qaTaskCoordinator.SummarizeResults(query);
   Console.WriteLine(results);

   ```

   Save the file, and then compile and run your project to complete your RAG (Retrieval-Augmented Generation) implementation:

   ```console
   dotnet run MyCompany.RAG.Local.csproj
   ```

   **Output:**

   ```text
   Based on the context provided, here are some Airbnb listings for beach houses that you might find interesting:

   1. Lani Beach House (Hawaii) - [Link](https://www.airbnb.com/rooms/11553333)
   2. Peaceful North Bondi House (Australia) - [Link](https://www.airbnb.com/rooms/10423504)
   3. Ocean Living! Secluded Secret Beach! (Florida, USA) - [Link](https://www.airbnb.com/rooms/10317142)
   4. Gorgeous Home just off the main road (California, USA) - [Link](https://www.airbnb.com/rooms/11719579)

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and Ollama.

1. Query the database for relevant documents.

   Add a new `PerformVectorQuery()` method in the file named `MongoDBDataService.cs`:

   ```csharp
   using MongoDB.Bson;
   using MongoDB.Driver;

   namespace MyCompany.RAG.Local;

   public class MongoDBDataService
   {
       private static readonly string? ConnectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
       private static readonly MongoClient Client = new MongoClient(ConnectionString);
       private static readonly IMongoDatabase Database = Client.GetDatabase("sample_airbnb");
       private static readonly IMongoCollection<BsonDocument> Collection = Database.GetCollection<BsonDocument>("listingsAndReviews");

       public List<BsonDocument>? GetDocuments()
       {
           var filter = Builders<BsonDocument>.Filter.And(
               Builders<BsonDocument>.Filter.And(
                   Builders<BsonDocument>.Filter.Exists("summary", true),
                   Builders<BsonDocument>.Filter.Ne("summary", "")
               ),
               Builders<BsonDocument>.Filter.Exists("embeddings", false)
           );
           return Collection.Find(filter).Limit(250).ToList();
       }

       public async Task<string> UpdateDocuments(Dictionary<string, float[]> embeddings)
       {
           var listWrites = new List<WriteModel<BsonDocument>>();
           foreach (var kvp in embeddings)
           {
               var filterForUpdate = Builders<BsonDocument>.Filter.Eq("_id", kvp.Key);
               var updateDefinition = Builders<BsonDocument>.Update.Set("embeddings", kvp.Value);
               listWrites.Add(new UpdateOneModel<BsonDocument>(filterForUpdate, updateDefinition));
           }

           try
           {
               var result = await Collection.BulkWriteAsync(listWrites);
               listWrites.Clear();
               return $"{result.ModifiedCount} documents updated successfully.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public string CreateVectorIndex()
       {
           try
           {
               var searchIndexView = Collection.SearchIndexes;
               var name = "vector_index";

               var definition = new BsonDocument
               {
                   {
                       "fields", new BsonArray
                       {
                           new BsonDocument
                           {
                               { "type", "vector" },
                               { "path", "embeddings" },
                               { "numDimensions", 768 },
                               { "similarity", "cosine" }
                           }
                       }
                   }
               };

               var model = new CreateSearchIndexModel(name, SearchIndexType.VectorSearch, definition);
               searchIndexView.CreateOne(model);
               Console.WriteLine($"New search index named {name} is building.");

               // Polling for index status
               Console.WriteLine("Polling to check if the index is ready. This may take up to a minute.");
               bool queryable = false;
               while (!queryable)
               {
                   var indexes = searchIndexView.List();
                   foreach (var index in indexes.ToEnumerable())
                   {
                       if (index["name"] == name)
                       {
                           queryable = index["queryable"].AsBoolean;
                       }
                   }
                   if (!queryable)
                   {
                       Thread.Sleep(5000);
                   }
               }
               return $"{name} is ready for querying.";
           }
           catch (Exception e)
           {
               return $"Exception: {e.Message}";
           }
       }

       public List<BsonDocument>? PerformVectorQuery(float[] vector)
       {
           var vectorSearchStage = new BsonDocument
           {
               {
                   "$vectorSearch",
                   new BsonDocument
                   {
                       { "index", "vector_index" },
                       { "path", "embeddings" },
                       { "queryVector", new BsonArray(vector) },
                       { "exact", true },
                       { "limit", 5 }
                   }
               }
           };
           var projectStage = new BsonDocument
           {
               {
                   "$project",
                   new BsonDocument
                   {
                       { "_id", 0 },
                       { "summary", 1 },
                       { "listing_url", 1 },
                       {
                           "score",
                           new BsonDocument
                           {
                               { "$meta", "vectorSearchScore" }
                           }
                       }
                   }
               }
           };
           var pipeline = new[] { vectorSearchStage, projectStage };
           return Collection.Aggregate<BsonDocument>(pipeline).ToList();
       }
   }

   ```

   This code performs a vector query on your cluster.

   Create another file called `PerformTestQuery.cs` and paste the following code into it:

   ```csharp
   namespace MyCompany.RAG.Local;

   public class PerformTestQuery
   {
       private readonly MongoDBDataService _dataService = new();
       private readonly OllamaAIService _ollamaAiService = new();

       public async Task<string> GetQueryResults(string question)
       {
           // Get the vector embedding for the query
           var query = question;
           var queryEmbedding = await _ollamaAiService.GetEmbedding(query);
           // Query the vector database for applicable query results
           var matchingDocuments = _dataService.PerformVectorQuery(queryEmbedding);
           // Construct a string from the query results for performing QA with the LLM
           var sb = new System.Text.StringBuilder();
           if (matchingDocuments != null)
           {
               foreach (var doc in matchingDocuments)
               {
                   sb.AppendLine($"Summary: {doc.GetValue("summary").ToString()}");
                   sb.AppendLine($"Listing URL: {doc.GetValue("listing_url").ToString()}");
               }
           }
           else
           {
               return "No matching documents found.";
           }
           return sb.ToString();
       }
   }

   ```

   This code contains the logic to:

   - Define an embedding for the query.

   - Retrieve matching documents from the `MongoDBDataService`.

   - Construct a string containing the "Summary" and "Listing URL" from each document to pass on to the LLM for summarizing.

   Run a test query to confirm you're getting the expected results.

   Replace the code in `Program.cs` with the following code:

   ```csharp
   using MyCompany.RAG.Local;

   var query = "beach house";
   var queryCoordinator = new PerformTestQuery();
   var result = await queryCoordinator.GetQueryResults(query);
   Console.WriteLine(result);

   ```

   Save the file, and then compile and run your project to test that you get the expected query results:

   ```shell
   dotnet run MyCompany.RAG.Local.csproj
   ```

   **Output:**

   ```text
   Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/11553333
   Summary: This peaceful house in North Bondi is 300m to the beach and a minute's walk to cafes and bars. With 3 bedrooms, (can sleep up to 8) it is perfect for families, friends and pets. The kitchen was recently renovated and a new lounge and chairs installed. The house has a peaceful, airy, laidback vibe  - a perfect beach retreat. Longer-term bookings encouraged. Parking for one car. A parking permit for a second car can also be obtained on request.
   Listing URL: https://www.airbnb.com/rooms/10423504
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10488837
   Summary: 4 Bedroom Country Beach House w/ option to add a separate studio unit- total of 5 bedrooms/2.5 baths at an additional cost.  27 girl steps to white sand beach & infamous Alligator Pond. Private road, NO highway to cross! Safe beach for children & seniors. Convenient! For pricing to add on additional Studio unit, click on our profile pic and input your dates for quote and details!
   Listing URL: https://www.airbnb.com/rooms/12906000
   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10317142

   ```

2. Download the local LLM model.

   Run the following command to pull the generative model:

   ```console
   ollama pull mistral
   ```

3. Answer questions on your data.

   Add some new static members to your `OllamaAIService.cs` class, for use in a new `SummarizeAnswer` async Task:

   ```csharp
   using Microsoft.Extensions.AI;

   namespace MyCompany.RAG.Local;

   public class OllamaAIService
   {
       private static readonly Uri OllamaUri = new("http://localhost:11434/");
       private static readonly string EmbeddingModelName = "nomic-embed-text";
       private static readonly OllamaEmbeddingGenerator EmbeddingGenerator = new OllamaEmbeddingGenerator(OllamaUri, EmbeddingModelName);
       private static readonly string ChatModelName = "mistral";
       private static readonly OllamaChatClient ChatClient = new OllamaChatClient(OllamaUri, ChatModelName);

       public async Task<float[]> GetEmbedding(string text)
       {
           var embedding = await EmbeddingGenerator.GenerateVectorAsync(text);
           return embedding.ToArray();
       }

       public async Task<string> SummarizeAnswer(string context)
       {
           string question = "Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.";

           string prompt = $"""
                            Use the following pieces of context to answer the question at the end.
                            Context: {context}
                            Question: {question}
                            """;

           ChatResponse response = await ChatClient.GetResponseAsync(prompt, new ChatOptions { MaxOutputTokens = 400 });
           return response.Text;
       }
   }

   ```

   This prompts the LLM and returns the response. The generated response might vary.

   Define a new `PerformQuestionAnswer` class to:

   - Define an embedding for the query.

   - Retrieve matching documents from the `MongoDBDataService`.

   - Use the LLM to summarize the response.

   ```csharp
   namespace MyCompany.RAG.Local;

   public class PerformQuestionAnswer
   {
       private readonly MongoDBDataService _dataService = new();
       private readonly OllamaAIService _ollamaAiService = new();

       public async Task<string> SummarizeResults(string question)
       {
           // Get the vector embedding for the query
           var query = question;
           var queryEmbedding = await _ollamaAiService.GetEmbedding(query);
           // Query the vector database for applicable query results
           var matchingDocuments = _dataService.PerformVectorQuery(queryEmbedding);
           // Construct a string from the query results for performing QA with the LLM
           var sb = new System.Text.StringBuilder();
           if (matchingDocuments != null)
           {
               foreach (var doc in matchingDocuments)
               {
                   sb.AppendLine($"Summary: {doc.GetValue("summary").ToString()}");
                   sb.AppendLine($"Listing URL: {doc.GetValue("listing_url").ToString()}");
               }
           }
           else
           {
               return "No matching documents found.";
           }
           return await _ollamaAiService.SummarizeAnswer(sb.ToString());
       }
   }

   ```

   Replace the contents of `Program.cs` with a new block to perform the task:

   ```csharp
   using MyCompany.RAG.Local;

   var qaTaskCoordinator = new PerformQuestionAnswer();
   const string query = "beach house";
   var results = await qaTaskCoordinator.SummarizeResults(query);
   Console.WriteLine(results);

   ```

   Save the file, and then compile and run your project to complete your RAG (Retrieval-Augmented Generation) implementation:

   ```console
   dotnet run MyCompany.RAG.Local.csproj
   ```

   **Output:**

   ```text
   Based on the context provided, here are some Airbnb listings for beach houses that you might find interesting:

   1. Lani Beach House (Hawaii) - [Link](https://www.airbnb.com/rooms/11553333)
   2. Peaceful North Bondi House (Australia) - [Link](https://www.airbnb.com/rooms/10423504)
   3. Ocean Living! Secluded Secret Beach! (Florida, USA) - [Link](https://www.airbnb.com/rooms/10317142)
   4. Gorgeous Home just off the main road (California, USA) - [Link](https://www.airbnb.com/rooms/11719579)

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and Ollama.

1. Query the database for relevant documents.

   Navigate to the `common` directory.

   ```console
   cd common
   ```

   Create a file called `retrieve-documents.go` and paste the following code into it:

   ```go
   package common

   import (
   	"context"
   	"log"
   	"os"

   	"github.com/joho/godotenv"
   	"github.com/tmc/langchaingo/embeddings"
   	"github.com/tmc/langchaingo/llms/ollama"
   	"github.com/tmc/langchaingo/schema"
   	"github.com/tmc/langchaingo/vectorstores/mongovector"
   	"go.mongodb.org/mongo-driver/v2/bson"
   	"go.mongodb.org/mongo-driver/v2/mongo"
   	"go.mongodb.org/mongo-driver/v2/mongo/options"
   )

   func RetrieveDocuments(query string) []schema.Document {
   	ctx := context.Background()

   	if err := godotenv.Load(); err != nil {
   		log.Fatal("no .env file found")
   	}

   	// Connect to your MongoDB cluster
   	uri := os.Getenv("MONGODB_URI")
   	if uri == "" {
   		log.Fatal("set your 'MONGODB_URI' environment variable.")
   	}
   	clientOptions := options.Client().ApplyURI(uri)
   	client, err := mongo.Connect(clientOptions)
   	if err != nil {
   		log.Fatalf("failed to connect to the server: %v", err)
   	}
   	defer func() { _ = client.Disconnect(ctx) }()

   	// Specify the database and collection
   	coll := client.Database("sample_airbnb").Collection("listingsAndReviews")

   	// Define the filter and update. The mongovector store reads the document
   	// text from pageContent and any extra fields from metadata, so copy the
   	// summary and listing URL into those fields.
   	filter := bson.D{
   		{Key: "embeddings", Value: bson.D{{Key: "$exists", Value: true}}},
   		{Key: "pageContent", Value: bson.D{{Key: "$exists", Value: false}}},
   		{Key: "metadata.listing_url", Value: bson.D{{Key: "$exists", Value: false}}},
   	}

   	update := mongo.Pipeline{
   		bson.D{{Key: "$set", Value: bson.D{
   			{Key: "pageContent", Value: "$summary"},
   			{Key: "metadata", Value: bson.D{{Key: "listing_url", Value: "$listing_url"}}},
   		}}},
   	}

   	// Perform the update
   	_, err = coll.UpdateMany(ctx, filter, update)
   	if err != nil {
   		log.Fatal(err)
   	}

   	llm, err := ollama.New(ollama.WithModel("nomic-embed-text"))
   	if err != nil {
   		log.Fatalf("failed to create an embeddings client: %v", err)
   	}

   	embedder, err := embeddings.NewEmbedder(llm)
   	if err != nil {
   		log.Fatalf("failed to create an embedder: %v", err)
   	}

   	store := mongovector.New(coll, embedder,
   		mongovector.WithIndex("vector_index"),
   		mongovector.WithPath("embeddings"))

   	// Search for similar documents.
   	docs, err := store.SimilaritySearch(context.Background(), query, 5)
   	if err != nil {
   		log.Fatalf("error performing similarity search: %v", err)
   	}

   	return docs
   }


   ```

   This code uses the [mongovector.SimilaritySearch()](https://pkg.go.dev/github.com/tmc/langchaingo/vectorstores/mongovector#Store.SimilaritySearch) method to perform a vector query on your cluster.

   Run a test query to confirm you're getting the expected results. Move back to the project root directory.

   ```console
   cd ../
   ```

   Create a new file called `test-query.go`, and paste the following code into it:

   ```go
   package main

   import (
   	"fmt"
   	"local-rag-mongodb/common" // Module that contains the RetrieveDocuments function
   	"log"
   	"strings"
   )

   func main() {
   	query := "beach house"
   	matchingDocuments := common.RetrieveDocuments(query)

   	if matchingDocuments == nil {
   		log.Fatal("No documents matched the query.\n")
   	}

   	var textDocuments strings.Builder
   	for _, doc := range matchingDocuments {

   		summary := doc.PageContent
   		listingURL, ok := doc.Metadata["listing_url"].(string)
   		if !ok {
   			log.Fatal("expected listing_url to be in document metadata and to be a string")
   		}
   		score := doc.Score

   		// Print the contents of the matching documents for verification
   		fmt.Printf("Summary: %v\n", summary)
   		fmt.Printf("Listing URL: %v\n", listingURL)
   		fmt.Printf("Score: %v\n", score)

   		// Build a single text string to use as the context for the QA
   		textDocuments.WriteString("Summary: ")
   		textDocuments.WriteString(summary)
   		textDocuments.WriteString("\n")
   		textDocuments.WriteString("Listing URL: ")
   		textDocuments.WriteString(listingURL)
   		textDocuments.WriteString("\n")
   	}

   	fmt.Printf("\nThe constructed context for the QA follows:\n\n")
   	fmt.Print(textDocuments.String())
   }


   ```

   Run the following code to execute the query:

   ```console
   go run test-query.go
   ```

   **Output:**

   ```text
   Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/11553333
   Score: 0.8571681
   Summary: This peaceful house in North Bondi is 300m to the beach and a minute's walk to cafes and bars. With 3 bedrooms, (can sleep up to 8) it is perfect for families, friends and pets. The kitchen was recently renovated and a new lounge and chairs installed. The house has a peaceful, airy, laidback vibe  - a perfect beach retreat. Longer-term bookings encouraged. Parking for one car. A parking permit for a second car can also be obtained on request.
   Listing URL: https://www.airbnb.com/rooms/10423504
   Score: 0.8425762
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10488837
   Score: 0.84032476
   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10317142
   Score: 0.83669275
   Summary: This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins).
   Listing URL: https://www.airbnb.com/rooms/11719579
   Score: 0.82625794

   The constructed context for the QA follows:

   Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/11553333
   Summary: This peaceful house in North Bondi is 300m to the beach and a minute's walk to cafes and bars. With 3 bedrooms, (can sleep up to 8) it is perfect for families, friends and pets. The kitchen was recently renovated and a new lounge and chairs installed. The house has a peaceful, airy, laidback vibe  - a perfect beach retreat. Longer-term bookings encouraged. Parking for one car. A parking permit for a second car can also be obtained on request.
   Listing URL: https://www.airbnb.com/rooms/10423504
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10488837
   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10317142
   Summary: This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins).
   Listing URL: https://www.airbnb.com/rooms/11719579

   ```

2. Download the local LLM model.

   Run the following command to pull the generative model:

   ```console
   ollama pull mistral
   ```

3. Answer questions on your data.

   Create a file called `local-llm.go` and paste the following code:

   ```go
   package main

   import (
   	"context"
   	"local-rag-mongodb/common" // Module that contains the RetrieveDocuments function
   	"log"
   	"strings"

   	"github.com/tmc/langchaingo/llms"
   	"github.com/tmc/langchaingo/llms/ollama"
   	"github.com/tmc/langchaingo/prompts"
   )

   func main() {
   	// Retrieve documents from the collection that match the query
   	const query = "beach house"
   	matchingDocuments := common.RetrieveDocuments(query)

   	if matchingDocuments == nil {
   		log.Fatalf("no documents matched the query %q", query)
   	}

   	// Generate the text string from the matching documents to pass to the
   	// LLM as context to answer the question
   	var textDocuments strings.Builder
   	for _, doc := range matchingDocuments {
   		textDocuments.WriteString("Summary: ")
   		textDocuments.WriteString(doc.PageContent)
   		textDocuments.WriteString("\n")
   		textDocuments.WriteString("Listing URL: ")
   		if metadata := doc.Metadata; metadata != nil {
   			if listingURL, ok := metadata["listing_url"]; ok {
   				textDocuments.WriteString(listingURL.(string))
   			}
   		}
   		textDocuments.WriteString("\n")
   	}

   	// Have the LLM answer the question using the provided context
   	llm, err := ollama.New(ollama.WithModel("mistral"))
   	if err != nil {
   		log.Fatalf("failed to initialize the Ollama Mistral model client: %v", err)
   	}

   	const question = `Can you recommend me a few AirBnBs that are beach houses?
   		Include a link to the listings.`
   	template := prompts.NewPromptTemplate(
   		`Use the following pieces of context to answer the question at the end.
   			Context: {{.context}}
   			Question: {{.question}}`,
   		[]string{"context", "question"},
   	)

   	prompt, err := template.Format(map[string]any{
   		"context":  textDocuments.String(),
   		"question": question,
   	})
   	if err != nil {
   		log.Fatalf("failed to format the prompt template: %v", err)
   	}

   	ctx := context.Background()
   	completion, err := llms.GenerateFromSinglePrompt(ctx, llm, prompt)
   	if err != nil {
   		log.Fatalf("failed to generate a response from the given prompt: %q", prompt)
   	}

   	log.Println("Response: ", completion)
   }


   ```

   This code does the following:

   - Creates an embedding for your query string.

   - Queries for relevant documents.

   - Prompts the LLM and returns the response. The generated response might vary.

   Run the following code to complete your RAG (Retrieval-Augmented Generation) implementation:

   ```console
   go run local-llm.go
   ```

   **Output:**

   ```text
   2025/03/19 11:56:27 Response:   Based on the context provided, here are some Airbnb listings for beach houses that you might find interesting:

   1. Lani Beach House (Hawaii) - [Link](https://www.airbnb.com/rooms/11553333)
   2. Peaceful North Bondi House (Australia) - [Link](https://www.airbnb.com/rooms/10423504)
   3. Ocean Living! Secluded Secret Beach! (Florida, USA) - [Link](https://www.airbnb.com/rooms/10317142)
   4. Gorgeous Home just off the main road (California, USA) - [Link](https://www.airbnb.com/rooms/11719579)

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and Ollama.

1. Query the database for relevant documents.

   Navigate to the `common` directory.

   ```console
   cd common
   ```

   Create a file called `retrieve-documents.go` and paste the following code into it:

   ```go
   package common

   import (
   	"context"
   	"log"
   	"os"

   	"github.com/joho/godotenv"
   	"github.com/tmc/langchaingo/embeddings"
   	"github.com/tmc/langchaingo/llms/ollama"
   	"github.com/tmc/langchaingo/schema"
   	"github.com/tmc/langchaingo/vectorstores/mongovector"
   	"go.mongodb.org/mongo-driver/v2/bson"
   	"go.mongodb.org/mongo-driver/v2/mongo"
   	"go.mongodb.org/mongo-driver/v2/mongo/options"
   )

   func RetrieveDocuments(query string) []schema.Document {
   	ctx := context.Background()

   	if err := godotenv.Load(); err != nil {
   		log.Fatal("no .env file found")
   	}

   	// Connect to your MongoDB cluster
   	uri := os.Getenv("MONGODB_URI")
   	if uri == "" {
   		log.Fatal("set your 'MONGODB_URI' environment variable.")
   	}
   	clientOptions := options.Client().ApplyURI(uri)
   	client, err := mongo.Connect(clientOptions)
   	if err != nil {
   		log.Fatalf("failed to connect to the server: %v", err)
   	}
   	defer func() { _ = client.Disconnect(ctx) }()

   	// Specify the database and collection
   	coll := client.Database("sample_airbnb").Collection("listingsAndReviews")

   	// Define the filter and update. The mongovector store reads the document
   	// text from pageContent and any extra fields from metadata, so copy the
   	// summary and listing URL into those fields.
   	filter := bson.D{
   		{Key: "embeddings", Value: bson.D{{Key: "$exists", Value: true}}},
   		{Key: "pageContent", Value: bson.D{{Key: "$exists", Value: false}}},
   		{Key: "metadata.listing_url", Value: bson.D{{Key: "$exists", Value: false}}},
   	}

   	update := mongo.Pipeline{
   		bson.D{{Key: "$set", Value: bson.D{
   			{Key: "pageContent", Value: "$summary"},
   			{Key: "metadata", Value: bson.D{{Key: "listing_url", Value: "$listing_url"}}},
   		}}},
   	}

   	// Perform the update
   	_, err = coll.UpdateMany(ctx, filter, update)
   	if err != nil {
   		log.Fatal(err)
   	}

   	llm, err := ollama.New(ollama.WithModel("nomic-embed-text"))
   	if err != nil {
   		log.Fatalf("failed to create an embeddings client: %v", err)
   	}

   	embedder, err := embeddings.NewEmbedder(llm)
   	if err != nil {
   		log.Fatalf("failed to create an embedder: %v", err)
   	}

   	store := mongovector.New(coll, embedder,
   		mongovector.WithIndex("vector_index"),
   		mongovector.WithPath("embeddings"))

   	// Search for similar documents.
   	docs, err := store.SimilaritySearch(context.Background(), query, 5)
   	if err != nil {
   		log.Fatalf("error performing similarity search: %v", err)
   	}

   	return docs
   }


   ```

   This code uses the [mongovector.SimilaritySearch()](https://pkg.go.dev/github.com/tmc/langchaingo/vectorstores/mongovector#Store.SimilaritySearch) method to perform a vector query on your cluster.

   Run a test query to confirm you're getting the expected results. Move back to the project root directory.

   ```console
   cd ../
   ```

   Create a new file called `test-query.go`, and paste the following code into it:

   ```go
   package main

   import (
   	"fmt"
   	"local-rag-mongodb/common" // Module that contains the RetrieveDocuments function
   	"log"
   	"strings"
   )

   func main() {
   	query := "beach house"
   	matchingDocuments := common.RetrieveDocuments(query)

   	if matchingDocuments == nil {
   		log.Fatal("No documents matched the query.\n")
   	}

   	var textDocuments strings.Builder
   	for _, doc := range matchingDocuments {

   		summary := doc.PageContent
   		listingURL, ok := doc.Metadata["listing_url"].(string)
   		if !ok {
   			log.Fatal("expected listing_url to be in document metadata and to be a string")
   		}
   		score := doc.Score

   		// Print the contents of the matching documents for verification
   		fmt.Printf("Summary: %v\n", summary)
   		fmt.Printf("Listing URL: %v\n", listingURL)
   		fmt.Printf("Score: %v\n", score)

   		// Build a single text string to use as the context for the QA
   		textDocuments.WriteString("Summary: ")
   		textDocuments.WriteString(summary)
   		textDocuments.WriteString("\n")
   		textDocuments.WriteString("Listing URL: ")
   		textDocuments.WriteString(listingURL)
   		textDocuments.WriteString("\n")
   	}

   	fmt.Printf("\nThe constructed context for the QA follows:\n\n")
   	fmt.Print(textDocuments.String())
   }


   ```

   Run the following code to execute the query:

   ```console
   go run test-query.go
   ```

   **Output:**

   ```text
   Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/11553333
   Score: 0.8571681
   Summary: This peaceful house in North Bondi is 300m to the beach and a minute's walk to cafes and bars. With 3 bedrooms, (can sleep up to 8) it is perfect for families, friends and pets. The kitchen was recently renovated and a new lounge and chairs installed. The house has a peaceful, airy, laidback vibe  - a perfect beach retreat. Longer-term bookings encouraged. Parking for one car. A parking permit for a second car can also be obtained on request.
   Listing URL: https://www.airbnb.com/rooms/10423504
   Score: 0.8425762
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10488837
   Score: 0.84032476
   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10317142
   Score: 0.83669275
   Summary: This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins).
   Listing URL: https://www.airbnb.com/rooms/11719579
   Score: 0.82625794

   The constructed context for the QA follows:

   Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/11553333
   Summary: This peaceful house in North Bondi is 300m to the beach and a minute's walk to cafes and bars. With 3 bedrooms, (can sleep up to 8) it is perfect for families, friends and pets. The kitchen was recently renovated and a new lounge and chairs installed. The house has a peaceful, airy, laidback vibe  - a perfect beach retreat. Longer-term bookings encouraged. Parking for one car. A parking permit for a second car can also be obtained on request.
   Listing URL: https://www.airbnb.com/rooms/10423504
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10488837
   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10317142
   Summary: This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins).
   Listing URL: https://www.airbnb.com/rooms/11719579

   ```

2. Download the local LLM model.

   Run the following command to pull the generative model:

   ```console
   ollama pull mistral
   ```

3. Answer questions on your data.

   Create a file called `local-llm.go` and paste the following code:

   ```go
   package main

   import (
   	"context"
   	"local-rag-mongodb/common" // Module that contains the RetrieveDocuments function
   	"log"
   	"strings"

   	"github.com/tmc/langchaingo/llms"
   	"github.com/tmc/langchaingo/llms/ollama"
   	"github.com/tmc/langchaingo/prompts"
   )

   func main() {
   	// Retrieve documents from the collection that match the query
   	const query = "beach house"
   	matchingDocuments := common.RetrieveDocuments(query)

   	if matchingDocuments == nil {
   		log.Fatalf("no documents matched the query %q", query)
   	}

   	// Generate the text string from the matching documents to pass to the
   	// LLM as context to answer the question
   	var textDocuments strings.Builder
   	for _, doc := range matchingDocuments {
   		textDocuments.WriteString("Summary: ")
   		textDocuments.WriteString(doc.PageContent)
   		textDocuments.WriteString("\n")
   		textDocuments.WriteString("Listing URL: ")
   		if metadata := doc.Metadata; metadata != nil {
   			if listingURL, ok := metadata["listing_url"]; ok {
   				textDocuments.WriteString(listingURL.(string))
   			}
   		}
   		textDocuments.WriteString("\n")
   	}

   	// Have the LLM answer the question using the provided context
   	llm, err := ollama.New(ollama.WithModel("mistral"))
   	if err != nil {
   		log.Fatalf("failed to initialize the Ollama Mistral model client: %v", err)
   	}

   	const question = `Can you recommend me a few AirBnBs that are beach houses?
   		Include a link to the listings.`
   	template := prompts.NewPromptTemplate(
   		`Use the following pieces of context to answer the question at the end.
   			Context: {{.context}}
   			Question: {{.question}}`,
   		[]string{"context", "question"},
   	)

   	prompt, err := template.Format(map[string]any{
   		"context":  textDocuments.String(),
   		"question": question,
   	})
   	if err != nil {
   		log.Fatalf("failed to format the prompt template: %v", err)
   	}

   	ctx := context.Background()
   	completion, err := llms.GenerateFromSinglePrompt(ctx, llm, prompt)
   	if err != nil {
   		log.Fatalf("failed to generate a response from the given prompt: %q", prompt)
   	}

   	log.Println("Response: ", completion)
   }


   ```

   This code does the following:

   - Creates an embedding for your query string.

   - Queries for relevant documents.

   - Prompts the LLM and returns the response. The generated response might vary.

   Run the following code to complete your RAG (Retrieval-Augmented Generation) implementation:

   ```console
   go run local-llm.go
   ```

   **Output:**

   ```text
   2025/03/19 11:56:27 Response:   Based on the context provided, here are some Airbnb listings for beach houses that you might find interesting:

   1. Lani Beach House (Hawaii) - [Link](https://www.airbnb.com/rooms/11553333)
   2. Peaceful North Bondi House (Australia) - [Link](https://www.airbnb.com/rooms/10423504)
   3. Ocean Living! Secluded Secret Beach! (Florida, USA) - [Link](https://www.airbnb.com/rooms/10317142)
   4. Gorgeous Home just off the main road (California, USA) - [Link](https://www.airbnb.com/rooms/11719579)

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and Ollama.

1. Write code to run the local LLM (Large Language Model).

   Create a new file called `LocalLLM.java` and paste the following code.

   This code uses the `getEmbedding()` and `retrieveDocuments` methods and the Ollama `chatmodel` to do the following:

   Connect to your cluster

   Generate an embedding for the query string using the `getEmbedding()` method you defined previously.

   Query the collection for relevant documents using the `retrieveDocuments` method.

   Our query includes an aggregation pipeline with a projection stage to return only the `listing_url`, `summary`, and vector `score` fields. You can modify or remove this pipeline to better suit your data and use case.

   Create a context by concatenating a question with the retrieved documents using the `createPrompt` method.

   Feed the created prompt to the LLM `chatmodel` you defined previously to generate a response.

   Print the question and generated response to the console.

   **Note:**

   For demonstration purposes, we also print the filled-in prompt with context information. You should remove this line in a production environment.

   ```java
   import static com.mongodb.client.model.Aggregates.project;
   import static com.mongodb.client.model.Aggregates.vectorSearch;
   import static com.mongodb.client.model.Projections.exclude;
   import static com.mongodb.client.model.Projections.fields;
   import static com.mongodb.client.model.Projections.include;
   import static com.mongodb.client.model.Projections.metaVectorSearchScore;
   import static com.mongodb.client.model.search.SearchPath.fieldPath;
   import static com.mongodb.client.model.search.VectorSearchOptions.exactVectorSearchOptions;
   import static java.util.Arrays.asList;

   import com.mongodb.MongoException;
   import com.mongodb.client.MongoClient;
   import com.mongodb.client.MongoClients;
   import com.mongodb.client.MongoCollection;
   import com.mongodb.client.MongoDatabase;
   import com.mongodb.client.model.search.FieldSearchPath;
   import dev.langchain4j.data.message.AiMessage;
   import dev.langchain4j.model.input.Prompt;
   import dev.langchain4j.model.input.PromptTemplate;
   import dev.langchain4j.model.ollama.OllamaChatModel;
   import java.util.ArrayList;
   import java.util.HashMap;
   import java.util.List;
   import java.util.Map;
   import org.bson.BsonArray;
   import org.bson.BsonValue;
   import org.bson.Document;
   import org.bson.conversions.Bson;

   public class LocalLLM {

       // User input: the question to answer
       static String question = "Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.";

       public static void main(String[] args) {

           String uri = System.getenv("MONGODB_URI");
           if (uri == null || uri.isEmpty()) {
               throw new IllegalStateException("MONGODB_URI env variable is not set or is empty.");
           }

           // establish connection and set namespace
           try (MongoClient mongoClient = MongoClients.create(uri)) {
               MongoDatabase database = mongoClient.getDatabase("sample_airbnb");
               MongoCollection<Document> collection = database.getCollection("listingsAndReviews");

               // generate a response to the user question
               System.out.println("Question: " + question);

               try {
                   createPrompt(question, collection);
               } catch (Exception e) {
                   throw new RuntimeException("An error occurred while generating the response: ", e);
               }

           } catch (MongoException me) {
               throw new RuntimeException("Failed to connect to MongoDB ", me);
           } catch (Exception e) {
               throw new RuntimeException("Operation failed: ", e);
           }
       }

       /**
        * Returns a list of documents from the specified MongoDB collection that
        * match the user's question.
        * NOTE: Update or omit the projection stage to change the desired fields in the response
        */
       public static List<Document> retrieveDocuments(String question, MongoCollection<Document> collection) {

           try {
               // generate the query embedding to use in the vector search
               BsonArray queryEmbeddingBsonArray = OllamaModels.getEmbedding(question);
               List<Double> queryEmbedding = new ArrayList<>();
               for (BsonValue value : queryEmbeddingBsonArray.stream().toList()) {
                   queryEmbedding.add(value.asDouble().getValue());
               }

               // define the pipeline stages for the vector search index
               String indexName = "vector_index";
               FieldSearchPath fieldSearchPath = fieldPath("embeddings");
               int limit = 5;

               List<Bson> pipeline = asList(
                       vectorSearch(fieldSearchPath, queryEmbedding, indexName, limit, exactVectorSearchOptions()),
                       project(fields(
                               exclude("_id"),
                               include("listing_url"),
                               include("summary"),
                               metaVectorSearchScore("score"))));

               // run the query and return the matching documents
               List<Document> matchingDocuments = new ArrayList<>();
               collection.aggregate(pipeline).forEach(matchingDocuments::add);
               return matchingDocuments;

           } catch (Exception e) {
               System.err.println("Error occurred while retrieving documents: " + e.getMessage());
               return new ArrayList<>();
           }
       }

       /**
        * Creates a templated prompt using the question and retrieved documents, then generates
        * a response using the local Ollama chat model.
        */
       public static void createPrompt(String question, MongoCollection<Document> collection) {

           // Retrieve documents matching the user's question
           List<Document> retrievedDocuments = retrieveDocuments(question, collection);

           if (retrievedDocuments.isEmpty()) {
               System.out.println("No relevant documents found. Unable to generate a response.");
               return;
           } else System.out.println("Generating a response from the retrieved documents. This may take a few moments.");

           // Create a prompt template
           OllamaChatModel ollamaChatModel = OllamaModels.getChatModel();
           PromptTemplate promptBuilder = PromptTemplate.from("""
               Use the following pieces of context to answer the question at the end:
               {{information}}
               ---------------
               {{question}}
               """);

           // build the information string from the retrieved documents
           StringBuilder informationBuilder = new StringBuilder();
           for (int i = 0; i < retrievedDocuments.size(); i++) {
               Document doc = retrievedDocuments.get(i);
               String listingUrl = doc.getString("listing_url");
               String summary = doc.getString("summary");
               informationBuilder
                       .append("Listing URL: ")
                       .append(listingUrl)
                       .append("\nSummary: ")
                       .append(summary)
                       .append("\n\n");
           }
           String information = informationBuilder.toString();

           Map<String, Object> variables = new HashMap<>();
           variables.put("question", question);
           variables.put("information", information);

           // generate and output the response from the chat model
           Prompt prompt = promptBuilder.apply(variables);
           AiMessage response = ollamaChatModel.generate(prompt.toUserMessage()).content();
           System.out.println("Answer: " + response.text());

           // display the filled-in prompt and context information
           // NOTE: included for demonstration purposes only
           System.out.println("______________________");
           System.out.println("Final Prompt Sent to LLM:");
           System.out.println(prompt.text());
           System.out.println("______________________");
           System.out.println("Number of documents in context: " + retrievedDocuments.size());
       }
   }

   ```

2. Download the local LLM model.

   Run the following command to pull the generative model:

   ```shell
   ollama pull mistral
   ```

3. Generate a response to a question on your data.

   Save and run the file to complete your RAG (Retrieval-Augmented Generation) implementation. The output resembles the following, although your generated response may vary:

   ```shell
   Question: Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.
   Generating a response from the retrieved documents. This may take a few moments.
   Answer:  Based on the context provided, here are some beach house Airbnb listings that might suit your needs:

   1. Lani Beach House - Aloha: This luxurious beach house offers ocean views from all bedrooms and features vaulted ceilings, skylights, granite countertops, stainless steel appliances, and a gourmet kitchen. You can find it at this link: https://www.airbnb.com/rooms/11553333
   2. Ocean Living! Secluded Secret Beach!: This spacious 4-bedroom, 4-bath beach house is perfect for families or groups and is less than 20 steps from the ocean. It's located in a gated beachfront estate with lots of space for activities. You can find it at this link: https://www.airbnb.com/rooms/10317142
   3. A beautiful and comfortable 1-Bedroom Condo in Makaha Valley: This condo offers stunning ocean and mountain views, a full kitchen, large bathroom, and is suited for longer stays. The famous Makaha Surfing Beach is not even a mile away. You can find it at this link: https://www.airbnb.com/rooms/10266175
   4. There are 2 bedrooms and a living room in the house: This listing does not provide much information about the beach, but it mentions that the house is close to the sea side and historical places. You can find it at this link: https://www.airbnb.com/rooms/10488837
   5. The Apartment on Copacabana beach block: This apartment is well-located, a 5-minute walk from Ipanema beach, and offers all the amenities of home, including a kitchen, washing machine, and several utensils for use. You can find it at this link: https://www.airbnb.com/rooms/10038496
   ______________________
   Final Prompt Sent to LLM:
   Use the following pieces of context to answer the question at the end:

   Listing URL: https://www.airbnb.com/rooms/11553333
    Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/10317142
    Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10266175
    Summary: A beautiful and comfortable 1 Bedroom Air Conditioned Condo in Makaha Valley - stunning Ocean & Mountain views All the amenities of home, suited for longer stays. Full kitchen & large bathroom.  Several gas BBQ's for all guests to use & a large heated pool surrounded by reclining chairs to sunbathe.  The Ocean you see in the pictures is not even a mile away, known as the famous Makaha Surfing Beach. Golfing, hiking,snorkeling  paddle boarding, surfing are all just minutes from the front door.
   Listing URL: https://www.airbnb.com/rooms/10488837
    Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10038496
    Summary: The Apartment has a living room, toilet, bedroom (suite) and American kitchen. Well located, on the Copacabana beach block a 05 Min. walk from Ipanema beach (Arpoador). Internet wifi, cable tv, air conditioning in the bedroom, ceiling fans in the bedroom and living room, kitchen with microwave, cooker, Blender, dishes, cutlery and service area with fridge, washing machine, clothesline for drying clothes and closet with several utensils for use.  The property boasts 45 m2.
   ---------------
   Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.

   ______________________
   Number of documents in context: 5

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and Ollama.

1. Write code to run the local LLM (Large Language Model).

   Create a new file called `LocalLLM.java` and paste the following code.

   This code uses the `getEmbedding()` and `retrieveDocuments` methods and the Ollama `chatmodel` to do the following:

   Connect to your cluster

   Generate an embedding for the query string using the `getEmbedding()` method you defined previously.

   Query the collection for relevant documents using the `retrieveDocuments` method.

   Our query includes an aggregation pipeline with a projection stage to return only the `listing_url`, `summary`, and vector `score` fields. You can modify or remove this pipeline to better suit your data and use case.

   Create a context by concatenating a question with the retrieved documents using the `createPrompt` method.

   Feed the created prompt to the LLM `chatmodel` you defined previously to generate a response.

   Print the question and generated response to the console.

   **Note:**

   For demonstration purposes, we also print the filled-in prompt with context information. You should remove this line in a production environment.

   ```java
   import static com.mongodb.client.model.Aggregates.project;
   import static com.mongodb.client.model.Aggregates.vectorSearch;
   import static com.mongodb.client.model.Projections.exclude;
   import static com.mongodb.client.model.Projections.fields;
   import static com.mongodb.client.model.Projections.include;
   import static com.mongodb.client.model.Projections.metaVectorSearchScore;
   import static com.mongodb.client.model.search.SearchPath.fieldPath;
   import static com.mongodb.client.model.search.VectorSearchOptions.exactVectorSearchOptions;
   import static java.util.Arrays.asList;

   import com.mongodb.MongoException;
   import com.mongodb.client.MongoClient;
   import com.mongodb.client.MongoClients;
   import com.mongodb.client.MongoCollection;
   import com.mongodb.client.MongoDatabase;
   import com.mongodb.client.model.search.FieldSearchPath;
   import dev.langchain4j.data.message.AiMessage;
   import dev.langchain4j.model.input.Prompt;
   import dev.langchain4j.model.input.PromptTemplate;
   import dev.langchain4j.model.ollama.OllamaChatModel;
   import java.util.ArrayList;
   import java.util.HashMap;
   import java.util.List;
   import java.util.Map;
   import org.bson.BsonArray;
   import org.bson.BsonValue;
   import org.bson.Document;
   import org.bson.conversions.Bson;

   public class LocalLLM {

       // User input: the question to answer
       static String question = "Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.";

       public static void main(String[] args) {

           String uri = System.getenv("MONGODB_URI");
           if (uri == null || uri.isEmpty()) {
               throw new IllegalStateException("MONGODB_URI env variable is not set or is empty.");
           }

           // establish connection and set namespace
           try (MongoClient mongoClient = MongoClients.create(uri)) {
               MongoDatabase database = mongoClient.getDatabase("sample_airbnb");
               MongoCollection<Document> collection = database.getCollection("listingsAndReviews");

               // generate a response to the user question
               System.out.println("Question: " + question);

               try {
                   createPrompt(question, collection);
               } catch (Exception e) {
                   throw new RuntimeException("An error occurred while generating the response: ", e);
               }

           } catch (MongoException me) {
               throw new RuntimeException("Failed to connect to MongoDB ", me);
           } catch (Exception e) {
               throw new RuntimeException("Operation failed: ", e);
           }
       }

       /**
        * Returns a list of documents from the specified MongoDB collection that
        * match the user's question.
        * NOTE: Update or omit the projection stage to change the desired fields in the response
        */
       public static List<Document> retrieveDocuments(String question, MongoCollection<Document> collection) {

           try {
               // generate the query embedding to use in the vector search
               BsonArray queryEmbeddingBsonArray = OllamaModels.getEmbedding(question);
               List<Double> queryEmbedding = new ArrayList<>();
               for (BsonValue value : queryEmbeddingBsonArray.stream().toList()) {
                   queryEmbedding.add(value.asDouble().getValue());
               }

               // define the pipeline stages for the vector search index
               String indexName = "vector_index";
               FieldSearchPath fieldSearchPath = fieldPath("embeddings");
               int limit = 5;

               List<Bson> pipeline = asList(
                       vectorSearch(fieldSearchPath, queryEmbedding, indexName, limit, exactVectorSearchOptions()),
                       project(fields(
                               exclude("_id"),
                               include("listing_url"),
                               include("summary"),
                               metaVectorSearchScore("score"))));

               // run the query and return the matching documents
               List<Document> matchingDocuments = new ArrayList<>();
               collection.aggregate(pipeline).forEach(matchingDocuments::add);
               return matchingDocuments;

           } catch (Exception e) {
               System.err.println("Error occurred while retrieving documents: " + e.getMessage());
               return new ArrayList<>();
           }
       }

       /**
        * Creates a templated prompt using the question and retrieved documents, then generates
        * a response using the local Ollama chat model.
        */
       public static void createPrompt(String question, MongoCollection<Document> collection) {

           // Retrieve documents matching the user's question
           List<Document> retrievedDocuments = retrieveDocuments(question, collection);

           if (retrievedDocuments.isEmpty()) {
               System.out.println("No relevant documents found. Unable to generate a response.");
               return;
           } else System.out.println("Generating a response from the retrieved documents. This may take a few moments.");

           // Create a prompt template
           OllamaChatModel ollamaChatModel = OllamaModels.getChatModel();
           PromptTemplate promptBuilder = PromptTemplate.from("""
               Use the following pieces of context to answer the question at the end:
               {{information}}
               ---------------
               {{question}}
               """);

           // build the information string from the retrieved documents
           StringBuilder informationBuilder = new StringBuilder();
           for (int i = 0; i < retrievedDocuments.size(); i++) {
               Document doc = retrievedDocuments.get(i);
               String listingUrl = doc.getString("listing_url");
               String summary = doc.getString("summary");
               informationBuilder
                       .append("Listing URL: ")
                       .append(listingUrl)
                       .append("\nSummary: ")
                       .append(summary)
                       .append("\n\n");
           }
           String information = informationBuilder.toString();

           Map<String, Object> variables = new HashMap<>();
           variables.put("question", question);
           variables.put("information", information);

           // generate and output the response from the chat model
           Prompt prompt = promptBuilder.apply(variables);
           AiMessage response = ollamaChatModel.generate(prompt.toUserMessage()).content();
           System.out.println("Answer: " + response.text());

           // display the filled-in prompt and context information
           // NOTE: included for demonstration purposes only
           System.out.println("______________________");
           System.out.println("Final Prompt Sent to LLM:");
           System.out.println(prompt.text());
           System.out.println("______________________");
           System.out.println("Number of documents in context: " + retrievedDocuments.size());
       }
   }

   ```

2. Download the local LLM model.

   Run the following command to pull the generative model:

   ```shell
   ollama pull mistral
   ```

3. Generate a response to a question on your data.

   Save and run the file to complete your RAG (Retrieval-Augmented Generation) implementation. The output resembles the following, although your generated response may vary:

   ```shell
   Question: Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.
   Generating a response from the retrieved documents. This may take a few moments.
   Answer:  Based on the context provided, here are some beach house Airbnb listings that might suit your needs:

   1. Lani Beach House - Aloha: This luxurious beach house offers ocean views from all bedrooms and features vaulted ceilings, skylights, granite countertops, stainless steel appliances, and a gourmet kitchen. You can find it at this link: https://www.airbnb.com/rooms/11553333
   2. Ocean Living! Secluded Secret Beach!: This spacious 4-bedroom, 4-bath beach house is perfect for families or groups and is less than 20 steps from the ocean. It's located in a gated beachfront estate with lots of space for activities. You can find it at this link: https://www.airbnb.com/rooms/10317142
   3. A beautiful and comfortable 1-Bedroom Condo in Makaha Valley: This condo offers stunning ocean and mountain views, a full kitchen, large bathroom, and is suited for longer stays. The famous Makaha Surfing Beach is not even a mile away. You can find it at this link: https://www.airbnb.com/rooms/10266175
   4. There are 2 bedrooms and a living room in the house: This listing does not provide much information about the beach, but it mentions that the house is close to the sea side and historical places. You can find it at this link: https://www.airbnb.com/rooms/10488837
   5. The Apartment on Copacabana beach block: This apartment is well-located, a 5-minute walk from Ipanema beach, and offers all the amenities of home, including a kitchen, washing machine, and several utensils for use. You can find it at this link: https://www.airbnb.com/rooms/10038496
   ______________________
   Final Prompt Sent to LLM:
   Use the following pieces of context to answer the question at the end:

   Listing URL: https://www.airbnb.com/rooms/11553333
    Summary: "Lani Beach House" Aloha - Please do not reserve until reading about the State Tax in "Other Things to Note" section. Please do not reserve unless you agree to pay taxes to Hawaii Beach Homes directly. If you have questions, please inquire before booking.   The home has been completely redecorated in a luxurious island style: vaulted ceilings, skylights, granite counter tops, stainless steel appliances and a gourmet kitchen are just some of the the features. All bedrooms have ocean views
   Listing URL: https://www.airbnb.com/rooms/10317142
    Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.
   Listing URL: https://www.airbnb.com/rooms/10266175
    Summary: A beautiful and comfortable 1 Bedroom Air Conditioned Condo in Makaha Valley - stunning Ocean & Mountain views All the amenities of home, suited for longer stays. Full kitchen & large bathroom.  Several gas BBQ's for all guests to use & a large heated pool surrounded by reclining chairs to sunbathe.  The Ocean you see in the pictures is not even a mile away, known as the famous Makaha Surfing Beach. Golfing, hiking,snorkeling  paddle boarding, surfing are all just minutes from the front door.
   Listing URL: https://www.airbnb.com/rooms/10488837
    Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.
   Listing URL: https://www.airbnb.com/rooms/10038496
    Summary: The Apartment has a living room, toilet, bedroom (suite) and American kitchen. Well located, on the Copacabana beach block a 05 Min. walk from Ipanema beach (Arpoador). Internet wifi, cable tv, air conditioning in the bedroom, ceiling fans in the bedroom and living room, kitchen with microwave, cooker, Blender, dishes, cutlery and service area with fridge, washing machine, clothesline for drying clothes and closet with several utensils for use.  The property boasts 45 m2.
   ---------------
   Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.

   ______________________
   Number of documents in context: 5

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and GPT4All.

1. Query the database for relevant documents.

   Create a file called `retrieve-documents.js` and paste the following code into it:

   ```javascript
   import { MongoClient } from 'mongodb';
   import { getEmbedding } from './get-embeddings.js';

   // Function to get the results of a vector query
   export async function getQueryResults(query) {
     // Connect to your cluster
     const client = new MongoClient(process.env.MONGODB_URI);

     try {
       // Get embedding for a query
       const queryEmbedding = await getEmbedding(query);

       await client.connect();
       const db = client.db('sample_airbnb');
       const collection = db.collection('listingsAndReviews');

       const pipeline = [
         {
           $vectorSearch: {
             index: 'vector_index',
             queryVector: queryEmbedding,
             path: 'embeddings',
             exact: true,
             limit: 5,
           },
         },
         {
           $project: {
             _id: 0,
             summary: 1,
             listing_url: 1,
             score: {
               $meta: 'vectorSearchScore',
             },
           },
         },
       ];

       // Retrieve documents using a Vector Search query
       const result = collection.aggregate(pipeline);

       const arrayOfQueryDocs = [];
       for await (const doc of result) {
         arrayOfQueryDocs.push(doc);
       }
       return arrayOfQueryDocs;
     } catch (err) {
       console.log(err.stack);
     } finally {
       await client.close();
     }
   }

   ```

   This code performs a vector query on your cluster.

   Run a test query to confirm you're getting the expected results. Create a new file called `test-query.js`, and paste the following code into it:

   ```javascript
   import { getQueryResults } from './retrieve-documents.js';

   try {
     const query = 'beach house';

     const documents = await getQueryResults(query);
     documents.forEach((doc) => {
       console.log(doc);
     });
   } catch (err) {
     console.log(err.stack);
   }

   ```

   Run the following code to execute the query:

   ```console
   node --env-file=.env test-query.js
   ```

   **Output:**

   ```text
   {
     listing_url: 'https://www.airbnb.com/rooms/10317142',
     summary: 'Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.',
     score: 0.8703486323356628
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/10488837',
     summary: 'There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.',
     score: 0.861828088760376
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/11719579',
     summary: 'This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins).',
     score: 0.8616757392883301
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/12657285',
     summary: 'This favourite home offers a huge balcony, lots of space, easy life, all the comfort you need and a fantastic location! The beach is only 3 minutes away. Metro is 2 blocks away (starting august 2016).',
     score: 0.8583258986473083
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/10985735',
     summary: '5 minutes to seaside where you can swim, and 5 minutes to the woods, this two floors single house contains a cultivated garden with fruit trees, two large bedrooms and a big living room with a large sea view.',
     score: 0.8573609590530396
   }
   ```

2. Download the local LLM and model information mapping.

   Click the following button to download the Mistral 7B model from GPT4All. To explore other models, refer to the [GPT4All website.](https://gpt4all.io/index.html)

   Download

   Move this model into your `local-rag-mongodb` project directory.

   In your project directory, download the file that contains the model information.

   ```console
   curl -L https://gpt4all.io/models/models3.json -o ./models3.json
   ```

3. Answer questions on your data.

   Create a file called `local-llm.js` and paste the following code:

   ```javascript
   import { loadModel, createCompletionStream } from 'gpt4all';
   import { getQueryResults } from './retrieve-documents.js';

   try {
     const query = 'beach house';

     const documents = await getQueryResults(query);

     let textDocuments = '';
     documents.forEach((doc) => {
       const summary = doc.summary;
       const link = doc.listing_url;
       const string = `Summary: ${summary} Link: ${link}. \n`;
       textDocuments += string;
     });

     const model = await loadModel('mistral-7b-openorca.gguf2.Q4_0.gguf', {
       verbose: true,
       allowDownload: false,
       modelConfigFile: './models3.json',
     });

     const question =
       'Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.';

     const prompt = `Use the following pieces of context to answer the question at the end.
             {${textDocuments}}
             Question: {${question}}`;

     process.stdout.write('Output: ');
     const stream = createCompletionStream(model, prompt);
     stream.tokens.on('data', (data) => {
       process.stdout.write(data);
     });
     //wait till stream finishes.
     await stream.result;
     process.stdout.write('\n');
     model.dispose();
     console.log('\n Source documents: \n');
     console.log(textDocuments);
   } catch (err) {
     console.log(err.stack);
   }

   ```

   This code does the following:

   - Creates an embedding for your query string.

   - Queries for relevant documents.

   - Prompts the LLM and returns the response. The generated response might vary.

   Run the following code to complete your RAG (Retrieval-Augmented Generation) implementation:

   ```console
   node --env-file=.env local-llm.js
   ```

   **Output:**

   ```text
   Found mistral-7b-openorca.gguf2.Q4_0.gguf at /Users/dachary.carey/.cache/gpt4all/mistral-7b-openorca.gguf2.Q4_0.gguf
   Creating LLModel: {
     llmOptions: {
       model_name: 'mistral-7b-openorca.gguf2.Q4_0.gguf',
       model_path: '/Users/dachary.carey/.cache/gpt4all',
       library_path: '/Users/dachary.carey/temp/local-rag-mongodb/node_modules/gpt4all/runtimes/darwin/native;/Users/dachary.carey/temp/local-rag-mongodb',
       device: 'cpu',
       nCtx: 2048,
       ngl: 100
     },
     modelConfig: {
       systemPrompt: '<|im_start|>system\n' +
         'You are MistralOrca, a large language model trained by Alignment Lab AI.\n' +
         '<|im_end|>',
       promptTemplate: '<|im_start|>user\n%1<|im_end|>\n<|im_start|>assistant\n%2<|im_end|>\n',
       order: 'e',
       md5sum: 'f692417a22405d80573ac10cb0cd6c6a',
       name: 'Mistral OpenOrca',
       filename: 'mistral-7b-openorca.gguf2.Q4_0.gguf',
       filesize: '4108928128',
       requires: '2.7.1',
       ramrequired: '8',
       parameters: '7 billion',
       quant: 'q4_0',
       type: 'Mistral',
       description: '<strong>Strong overall fast chat model</strong><br><ul><li>Fast responses</li><li>Chat based model</li><li>Trained by Mistral AI<li>Finetuned on OpenOrca dataset curated via <a href="https://atlas.nomic.ai/">Nomic Atlas</a><li>Licensed for commercial use</ul>',
       url: 'https://gpt4all.io/models/gguf/mistral-7b-openorca.gguf2.Q4_0.gguf',
       path: '/Users/dachary.carey/.cache/gpt4all/mistral-7b-openorca.gguf2.Q4_0.gguf'
     }
   }
   Output:  Yes, here are a few AirBnB beach houses with links to the listings:

   1. Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! - https://www.airbnb.com/rooms/10317142
   2. 2 Bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places - https://www.airbnb.com/rooms/10488837
   3. Gorgeous home just off the main rd, with lots of sun and new amenities. Room has own entrance with small deck, close proximity to the beach - https://www.airbnb.com/rooms/11719579
   4. This favourite home offers a huge balcony, lots of space, easy life, all the comfort you need and a fantastic location! The beach is only 3 minutes away. Metro is 2 blocks away (starting august 2016) - https://www.airbnb.com/rooms/12657285
   5. 5 minutes to seaside where you can swim, and 5 minutes to the woods, this two floors single house contains a cultivated garden with fruit trees, two large bedrooms and a big living room with a large sea view - https://www.airbnb.com/rooms/10985735

   Source documents:

   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities. Link: https://www.airbnb.com/rooms/10317142.
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places. Link: https://www.airbnb.com/rooms/10488837.
   Summary: This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins). Link: https://www.airbnb.com/rooms/11719579.
   Summary: This favourite home offers a huge balcony, lots of space, easy life, all the comfort you need and a fantastic location! The beach is only 3 minutes away. Metro is 2 blocks away (starting august 2016). Link: https://www.airbnb.com/rooms/12657285.
   Summary: 5 minutes to seaside where you can swim, and 5 minutes to the woods, this two floors single house contains a cultivated garden with fruit trees, two large bedrooms and a big living room with a large sea view. Link: https://www.airbnb.com/rooms/10985735.

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and GPT4All.

1. Query the database for relevant documents.

   Create a file called `retrieve-documents.js` and paste the following code into it:

   ```javascript
   import { MongoClient } from 'mongodb';
   import { getEmbedding } from './get-embeddings.js';

   // Function to get the results of a vector query
   export async function getQueryResults(query) {
     // Connect to your cluster
     const client = new MongoClient(process.env.MONGODB_URI);

     try {
       // Get embedding for a query
       const queryEmbedding = await getEmbedding(query);

       await client.connect();
       const db = client.db('sample_airbnb');
       const collection = db.collection('listingsAndReviews');

       const pipeline = [
         {
           $vectorSearch: {
             index: 'vector_index',
             queryVector: queryEmbedding,
             path: 'embeddings',
             exact: true,
             limit: 5,
           },
         },
         {
           $project: {
             _id: 0,
             summary: 1,
             listing_url: 1,
             score: {
               $meta: 'vectorSearchScore',
             },
           },
         },
       ];

       // Retrieve documents using a Vector Search query
       const result = collection.aggregate(pipeline);

       const arrayOfQueryDocs = [];
       for await (const doc of result) {
         arrayOfQueryDocs.push(doc);
       }
       return arrayOfQueryDocs;
     } catch (err) {
       console.log(err.stack);
     } finally {
       await client.close();
     }
   }

   ```

   This code performs a vector query on your cluster.

   Run a test query to confirm you're getting the expected results. Create a new file called `test-query.js`, and paste the following code into it:

   ```javascript
   import { getQueryResults } from './retrieve-documents.js';

   try {
     const query = 'beach house';

     const documents = await getQueryResults(query);
     documents.forEach((doc) => {
       console.log(doc);
     });
   } catch (err) {
     console.log(err.stack);
   }

   ```

   Run the following code to execute the query:

   ```console
   node --env-file=.env test-query.js
   ```

   **Output:**

   ```text
   {
     listing_url: 'https://www.airbnb.com/rooms/10317142',
     summary: 'Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities.',
     score: 0.8703486323356628
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/10488837',
     summary: 'There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places.',
     score: 0.861828088760376
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/11719579',
     summary: 'This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins).',
     score: 0.8616757392883301
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/12657285',
     summary: 'This favourite home offers a huge balcony, lots of space, easy life, all the comfort you need and a fantastic location! The beach is only 3 minutes away. Metro is 2 blocks away (starting august 2016).',
     score: 0.8583258986473083
   }
   {
     listing_url: 'https://www.airbnb.com/rooms/10985735',
     summary: '5 minutes to seaside where you can swim, and 5 minutes to the woods, this two floors single house contains a cultivated garden with fruit trees, two large bedrooms and a big living room with a large sea view.',
     score: 0.8573609590530396
   }
   ```

2. Download the local LLM and model information mapping.

   Click the following button to download the Mistral 7B model from GPT4All. To explore other models, refer to the [GPT4All website.](https://gpt4all.io/index.html)

   Download

   Move this model into your `local-rag-mongodb` project directory.

   In your project directory, download the file that contains the model information.

   ```console
   curl -L https://gpt4all.io/models/models3.json -o ./models3.json
   ```

3. Answer questions on your data.

   Create a file called `local-llm.js` and paste the following code:

   ```javascript
   import { loadModel, createCompletionStream } from 'gpt4all';
   import { getQueryResults } from './retrieve-documents.js';

   try {
     const query = 'beach house';

     const documents = await getQueryResults(query);

     let textDocuments = '';
     documents.forEach((doc) => {
       const summary = doc.summary;
       const link = doc.listing_url;
       const string = `Summary: ${summary} Link: ${link}. \n`;
       textDocuments += string;
     });

     const model = await loadModel('mistral-7b-openorca.gguf2.Q4_0.gguf', {
       verbose: true,
       allowDownload: false,
       modelConfigFile: './models3.json',
     });

     const question =
       'Can you recommend me a few AirBnBs that are beach houses? Include a link to the listings.';

     const prompt = `Use the following pieces of context to answer the question at the end.
             {${textDocuments}}
             Question: {${question}}`;

     process.stdout.write('Output: ');
     const stream = createCompletionStream(model, prompt);
     stream.tokens.on('data', (data) => {
       process.stdout.write(data);
     });
     //wait till stream finishes.
     await stream.result;
     process.stdout.write('\n');
     model.dispose();
     console.log('\n Source documents: \n');
     console.log(textDocuments);
   } catch (err) {
     console.log(err.stack);
   }

   ```

   This code does the following:

   - Creates an embedding for your query string.

   - Queries for relevant documents.

   - Prompts the LLM and returns the response. The generated response might vary.

   Run the following code to complete your RAG (Retrieval-Augmented Generation) implementation:

   ```console
   node --env-file=.env local-llm.js
   ```

   **Output:**

   ```text
   Found mistral-7b-openorca.gguf2.Q4_0.gguf at /Users/dachary.carey/.cache/gpt4all/mistral-7b-openorca.gguf2.Q4_0.gguf
   Creating LLModel: {
     llmOptions: {
       model_name: 'mistral-7b-openorca.gguf2.Q4_0.gguf',
       model_path: '/Users/dachary.carey/.cache/gpt4all',
       library_path: '/Users/dachary.carey/temp/local-rag-mongodb/node_modules/gpt4all/runtimes/darwin/native;/Users/dachary.carey/temp/local-rag-mongodb',
       device: 'cpu',
       nCtx: 2048,
       ngl: 100
     },
     modelConfig: {
       systemPrompt: '<|im_start|>system\n' +
         'You are MistralOrca, a large language model trained by Alignment Lab AI.\n' +
         '<|im_end|>',
       promptTemplate: '<|im_start|>user\n%1<|im_end|>\n<|im_start|>assistant\n%2<|im_end|>\n',
       order: 'e',
       md5sum: 'f692417a22405d80573ac10cb0cd6c6a',
       name: 'Mistral OpenOrca',
       filename: 'mistral-7b-openorca.gguf2.Q4_0.gguf',
       filesize: '4108928128',
       requires: '2.7.1',
       ramrequired: '8',
       parameters: '7 billion',
       quant: 'q4_0',
       type: 'Mistral',
       description: '<strong>Strong overall fast chat model</strong><br><ul><li>Fast responses</li><li>Chat based model</li><li>Trained by Mistral AI<li>Finetuned on OpenOrca dataset curated via <a href="https://atlas.nomic.ai/">Nomic Atlas</a><li>Licensed for commercial use</ul>',
       url: 'https://gpt4all.io/models/gguf/mistral-7b-openorca.gguf2.Q4_0.gguf',
       path: '/Users/dachary.carey/.cache/gpt4all/mistral-7b-openorca.gguf2.Q4_0.gguf'
     }
   }
   Output:  Yes, here are a few AirBnB beach houses with links to the listings:

   1. Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! - https://www.airbnb.com/rooms/10317142
   2. 2 Bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places - https://www.airbnb.com/rooms/10488837
   3. Gorgeous home just off the main rd, with lots of sun and new amenities. Room has own entrance with small deck, close proximity to the beach - https://www.airbnb.com/rooms/11719579
   4. This favourite home offers a huge balcony, lots of space, easy life, all the comfort you need and a fantastic location! The beach is only 3 minutes away. Metro is 2 blocks away (starting august 2016) - https://www.airbnb.com/rooms/12657285
   5. 5 minutes to seaside where you can swim, and 5 minutes to the woods, this two floors single house contains a cultivated garden with fruit trees, two large bedrooms and a big living room with a large sea view - https://www.airbnb.com/rooms/10985735

   Source documents:

   Summary: Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! This spacious 4 Bedroom and 4 Bath house has all you need for your family or group. Perfect for Family Vacations and executive retreats. We are in a gated beachfront estate, with lots of space for your activities. Link: https://www.airbnb.com/rooms/10317142.
   Summary: There are 2 bedrooms and a living room in the house. 1 Bathroom. 1 Kitchen. Friendly neighbourhood. Close to sea side and Historical places. Link: https://www.airbnb.com/rooms/10488837.
   Summary: This is a gorgeous home just off the main rd, with lots of sun and new amenities. room has own entrance with small deck, close proximity to the beach , bus to the junction , around the corner form all the cafes, bars and restaurants (2 mins). Link: https://www.airbnb.com/rooms/11719579.
   Summary: This favourite home offers a huge balcony, lots of space, easy life, all the comfort you need and a fantastic location! The beach is only 3 minutes away. Metro is 2 blocks away (starting august 2016). Link: https://www.airbnb.com/rooms/12657285.
   Summary: 5 minutes to seaside where you can swim, and 5 minutes to the woods, this two floors single house contains a cultivated garden with fruit trees, two large bedrooms and a big living room with a large sea view. Link: https://www.airbnb.com/rooms/10985735.

   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and GPT4All.

In your notebook, run the following code snippets:

1. Use MongoDB Vector Search to retrieve relevant documents.

   In this step, you create a retrieval function called `get_query_results()` that runs a sample vector search query. It uses the `get_embedding()` function to create embeddings from the search query. Then, it runs the query to return semantically similar documents.

   To learn more, see [Run Vector Search ANN and ENN Queries.](https://www.mongodb.com/docs/vector-search/query/aggregation-stages/vector-search-stage.md#std-label-return-vector-search-results)

   ```python
   # Function to get the results of a vector search query
   def get_query_results(query):
       query_embedding = get_embedding(query)

       pipeline = [
           {
               "$vectorSearch": {
                   "index": "vector_index",
                   "queryVector": query_embedding,
                   "path": "embeddings",
                   "exact": True,
                   "limit": 5,
               }
           },
           {
               "$project": {
                   "_id": 0,
                   "summary": 1,
                   "listing_url": 1,
                   "score": {"$meta": "vectorSearchScore"},
               }
           },
       ]

       results = collection.aggregate(pipeline)

       array_of_results = []
       for doc in results:
           array_of_results.append(doc)
       return array_of_results


   ```

   To check that the function returns relevant documents, run the following code to query for the search term `beach house`:

   **Note:**

   Your output might vary since environment differences can introduce slight variations to your embeddings.

   ```python
   import pprint
   pprint.pprint(get_query_results("beach house"))
   ```

   **Output:**

   ```text
   [{'listing_url': 'https://www.airbnb.com/rooms/10317142',
     'score': 0.84868323802948,
     'summary': 'Ocean Living! Secluded Secret Beach! Less than 20 steps to the '
                'Ocean! This spacious 4 Bedroom and 4 Bath house has all you need '
                'for your family or group. Perfect for Family Vacations and '
                'executive retreats. We are in a gated beachfront estate, with '
                'lots of space for your activities.'},
    {'listing_url': 'https://www.airbnb.com/rooms/10488837',
     'score': 0.8457906246185303,
     'summary': 'There are 2 bedrooms and a living room in the house. 1 Bathroom. '
                '1 Kitchen. Friendly neighbourhood. Close to sea side and '
                'Historical places.'},
    {'listing_url': 'https://www.airbnb.com/rooms/10423504',
     'score': 0.830578088760376,
     'summary': 'This peaceful house in North Bondi is 300m to the beach and a '
                "minute's walk to cafes and bars. With 3 bedrooms, (can sleep up "
                'to 8) it is perfect for families, friends and pets. The kitchen '
                'was recently renovated and a new lounge and chairs installed. '
                'The house has a peaceful, airy, laidback vibe  - a perfect beach '
                'retreat. Longer-term bookings encouraged. Parking for one car. A '
                'parking permit for a second car can also be obtained on '
                'request.'},
    {'listing_url': 'https://www.airbnb.com/rooms/10548991',
     'score': 0.8174338340759277,
     'summary': 'Newly furnished two story home. The upstairs features a full '
   ...
    {'listing_url': 'https://www.airbnb.com/rooms/10186755',
     'score': 0.8083034157752991,
     'summary': 'Near to underground metro station. Walking distance to seaside. '
                '2 floors 1 entry. Husband, wife, girl and boy is living.'}]
   ```

2. Load the local LLM (Large Language Model).

   Click the following button to download the Mistral 7B model from GPT4All. To explore other models, refer to the [GPT4All website.](https://gpt4all.io/index.html)

   Download

   Move this model into your `local-rag-mongodb` project directory.

   In your notebook, run the following code to load the local LLM (Large Language Model).

   ```python
   from gpt4all import GPT4All

   local_llm_path = "./mistral-7b-openorca.gguf2.Q4_0.gguf"
   local_llm = GPT4All(local_llm_path)

   ```

3. Answer questions on your data.

   Run the following code to complete your RAG (Retrieval-Augmented Generation) implementation. This code does the following:

   - Queries your collection for relevant documents by using the function you just defined.

   - Prompts the LLM using the retrieved documents as context. The generated response might vary.

   ```python
   question = "Can you recommend a few AirBnBs that are beach houses? Include a link to the listing."
   documents = get_query_results(question)

   text_documents = ""
   for doc in documents:
       summary = doc.get("summary", "")
       link = doc.get("listing_url", "")
       string = f"Summary: {summary} Link: {link}. \n"
       text_documents += string

   prompt = f"""Use the following pieces of context to answer the question at the end.
       {text_documents}
       Question: {question}
   """

   response = local_llm.generate(prompt)
   cleaned_response = response.replace("\\n", "\n")
   print(cleaned_response)

   ```

   **Output:**

   ```text
   Answer: Yes, I can recommend a few AirBnB listings that are beach houses. Here they are with their respective links:
   1. Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! (https://www.airbnb.com/rooms/10317142)
   2. Beautiful and comfortable 1 Bedroom Air Conditioned Condo in Makaha Valley - stunning Ocean & Mountain views (https://www.airbnb.com/rooms/10266175)
   3. Peaceful house in North Bondi, close to the beach and cafes (https://www.airbnb.com/rooms/10423504)
   ```

This section demonstrates a sample RAG (Retrieval-Augmented Generation) implementation that you can run locally using MongoDB Vector Search and GPT4All.

In your notebook, run the following code snippets:

1. Use MongoDB Vector Search to retrieve relevant documents.

   In this step, you create a retrieval function called `get_query_results()` that runs a sample vector search query. It uses the `get_embedding()` function to create embeddings from the search query. Then, it runs the query to return semantically similar documents.

   To learn more, see [Run Vector Search ANN and ENN Queries.](https://www.mongodb.com/docs/vector-search/query/aggregation-stages/vector-search-stage.md#std-label-return-vector-search-results)

   ```python
   # Function to get the results of a vector search query
   def get_query_results(query):
       query_embedding = get_embedding(query)

       pipeline = [
           {
               "$vectorSearch": {
                   "index": "vector_index",
                   "queryVector": query_embedding,
                   "path": "embeddings",
                   "exact": True,
                   "limit": 5,
               }
           },
           {
               "$project": {
                   "_id": 0,
                   "summary": 1,
                   "listing_url": 1,
                   "score": {"$meta": "vectorSearchScore"},
               }
           },
       ]

       results = collection.aggregate(pipeline)

       array_of_results = []
       for doc in results:
           array_of_results.append(doc)
       return array_of_results


   ```

   To check that the function returns relevant documents, run the following code to query for the search term `beach house`:

   **Note:**

   Your output might vary since environment differences can introduce slight variations to your embeddings.

   ```python
   import pprint
   pprint.pprint(get_query_results("beach house"))
   ```

   **Output:**

   ```text
   [{'listing_url': 'https://www.airbnb.com/rooms/10317142',
     'score': 0.84868323802948,
     'summary': 'Ocean Living! Secluded Secret Beach! Less than 20 steps to the '
                'Ocean! This spacious 4 Bedroom and 4 Bath house has all you need '
                'for your family or group. Perfect for Family Vacations and '
                'executive retreats. We are in a gated beachfront estate, with '
                'lots of space for your activities.'},
    {'listing_url': 'https://www.airbnb.com/rooms/10488837',
     'score': 0.8457906246185303,
     'summary': 'There are 2 bedrooms and a living room in the house. 1 Bathroom. '
                '1 Kitchen. Friendly neighbourhood. Close to sea side and '
                'Historical places.'},
    {'listing_url': 'https://www.airbnb.com/rooms/10423504',
     'score': 0.830578088760376,
     'summary': 'This peaceful house in North Bondi is 300m to the beach and a '
                "minute's walk to cafes and bars. With 3 bedrooms, (can sleep up "
                'to 8) it is perfect for families, friends and pets. The kitchen '
                'was recently renovated and a new lounge and chairs installed. '
                'The house has a peaceful, airy, laidback vibe  - a perfect beach '
                'retreat. Longer-term bookings encouraged. Parking for one car. A '
                'parking permit for a second car can also be obtained on '
                'request.'},
    {'listing_url': 'https://www.airbnb.com/rooms/10548991',
     'score': 0.8174338340759277,
     'summary': 'Newly furnished two story home. The upstairs features a full '
   ...
    {'listing_url': 'https://www.airbnb.com/rooms/10186755',
     'score': 0.8083034157752991,
     'summary': 'Near to underground metro station. Walking distance to seaside. '
                '2 floors 1 entry. Husband, wife, girl and boy is living.'}]
   ```

2. Load the local LLM (Large Language Model).

   Click the following button to download the Mistral 7B model from GPT4All. To explore other models, refer to the [GPT4All website.](https://gpt4all.io/index.html)

   Download

   Move this model into your `local-rag-mongodb` project directory.

   In your notebook, run the following code to load the local LLM (Large Language Model).

   ```python
   from gpt4all import GPT4All

   local_llm_path = "./mistral-7b-openorca.gguf2.Q4_0.gguf"
   local_llm = GPT4All(local_llm_path)

   ```

3. Answer questions on your data.

   Run the following code to complete your RAG (Retrieval-Augmented Generation) implementation. This code does the following:

   - Queries your collection for relevant documents by using the function you just defined.

   - Prompts the LLM using the retrieved documents as context. The generated response might vary.

   ```python
   question = "Can you recommend a few AirBnBs that are beach houses? Include a link to the listing."
   documents = get_query_results(question)

   text_documents = ""
   for doc in documents:
       summary = doc.get("summary", "")
       link = doc.get("listing_url", "")
       string = f"Summary: {summary} Link: {link}. \n"
       text_documents += string

   prompt = f"""Use the following pieces of context to answer the question at the end.
       {text_documents}
       Question: {question}
   """

   response = local_llm.generate(prompt)
   cleaned_response = response.replace("\\n", "\n")
   print(cleaned_response)

   ```

   **Output:**

   ```text
   Answer: Yes, I can recommend a few AirBnB listings that are beach houses. Here they are with their respective links:
   1. Ocean Living! Secluded Secret Beach! Less than 20 steps to the Ocean! (https://www.airbnb.com/rooms/10317142)
   2. Beautiful and comfortable 1 Bedroom Air Conditioned Condo in Makaha Valley - stunning Ocean & Mountain views (https://www.airbnb.com/rooms/10266175)
   3. Peaceful house in North Bondi, close to the beach and cafes (https://www.airbnb.com/rooms/10423504)
   ```
