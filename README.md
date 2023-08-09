# EtherDiffer
Differential Testing Tool for RPC Handling of Ethereum Nodes

## Structure
* `clients/`: Binary files of target nodes 
* `configs/`: Configuration template files for network construction
* `contracts/`: Smart contracts used for testing
* `node_modules/`: Dependency packages of EtherDiffer
* `package.json`, `package-lock.json`: Dependency information files
* `src/`: Main implementation of EtherDiffer
* `transactions/`: Source files for multi-concurrent transactions

## How to Reproduce

### Prerequisites
* Node v19.4.0
* .NET SDK 6.0
* OpenJDK JRE 16
* libsnappy-dev, libc6-dev, libc6

### Reproduction Steps
Install the prerequisites if not installed:

(Node v19.4.0) 
We recommend the installation using NVM(Node Version Manager)
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
$ source $HOME/.nvm/nvm.sh
$ nvm install 19.4.0 && nvm alias default 19.4.0 && nvm use default
```

(.NET SDK 6.0)
```
$ wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
$ sudo dpkg -i packages-microsoft-prod.deb
$ rm packages-microsoft-prod.deb
$ sudo apt-get update && sudo apt-get install -y dotnet-sdk-6.0
```

(OpenJDK JRE 16)
```
$ sudo apt-get -y install openjdk-16-jre
```

(libsnappy-dev, libc6-dev, libc6)
```
$ sudo apt-get -y install libsnappy-dev libc6-dev libc6
```

Once installed, enjoy EtherDiffer with the following command:
```
$ node src/main.js
```

Optionally, you can specify parameters:
<pre>
--chain value        (default: 300)
    Height of non-deterministic chain to generate
--tc value           (default: 600)
    Number of test cases to generate
--mut-prob value     (default: 50)
    Probability of invalid test case mutation
</pre>
```
$ node src/main.js --chain 30 --tc 60 --mut-prob 0
```

When executed, EtherDiffer goes through the following phases:

#### 1. Network Construction
* Initializing a private network consisted of target nodes
* Setting up resources necessary for testing <br/>
(creating accounts, charging with Ether, and deploying smart contracts)

#### 2. Chain Generation
* Generating a non-deterministic chain by multi-concurrent transactions <br/>
(This might take a while depending on `--chain` parameter)

#### 3. Test Case Generation
* Generating both semantically-valid and invalid-yet-executable test cases
* To disable valid test case generation: `--mut-prob 100`
* To disable invalid test case mutation: `--mut-prob 0` 

#### 4. Execution and Deviation Report
EtherDiffer creates `out` directory that contains report files:
* `exec-results`: Execution results from each target node
* `reports/`: Error and value deviations found by EtherDiffer

Also, the directory contains all other resources to reproduce deviations:
* `configs/`: Network configuration files for each target node
* `data/`: Chain data directory for each target node
* `testcases/`: Generated test cases

### Docker Image Support
Alternatively, we provide a public docker image with all prerequisites installed:
```
$ docker pull josephkim95/etherdiffer:latest
```

To run the docker image with the default setting, execute the following command:
```
$ docker run -it -v $PWD/out:/app/out/ josephkim95/etherdiffer:latest
```

You can also specify parameters. For example, the following command is possible:
```
$ docker run -it -v $PWD/out:/app/out/ josephkim95/etherdiffer:latest node src/main.js --chain 30 --tc 60 --mut-prob 0
```

### Tested Environment
* Operating system: Ubuntu 20.04
* Docker image: Docker version 20.10.17

## Bug and Issue Reports

<https://github.com/ethereum/execution-apis/issues/286>

<https://github.com/ethereum/execution-apis/issues/288>

<https://github.com/ledgerwatch/erigon/issues/4962>

<https://github.com/ledgerwatch/erigon/issues/4989>

<https://github.com/hyperledger/besu/issues/4248>

<https://github.com/hyperledger/besu/issues/4249>

<https://github.com/NethermindEth/nethermind/issues/4396>

<https://github.com/NethermindEth/nethermind/issues/4394>

<https://github.com/hyperledger/besu/issues/4239>

<https://github.com/hyperledger/besu/issues/4242>

<https://github.com/hyperledger/besu/issues/4231>

<https://github.com/NethermindEth/nethermind/issues/4395>

<https://github.com/hyperledger/besu/issues/4244>

<https://github.com/ledgerwatch/erigon/issues/4982>

<https://github.com/hyperledger/besu/issues/4245>

## Acknowledgements

> "thank you for these reports, this is very helpful."

> "the feedback you have provided is already extremely useful."

> "Firstly, thanks so much! Super useful."

> "I'm super interested in this project. Is there a website or GitHub repo? I'd like to read more about it. Very interested."

> "hard data and steps to reproduce is very useful. Thanks again!"
