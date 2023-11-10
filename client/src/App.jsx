import './App.css';
import { useState, useEffect } from 'react';
import { Web3 } from 'web3';
import SimpleStorage from "./contracts/SimpleStorage.json"; 

const PROVIDER_URL = import.meta.env.VITE_NODE_URL;
console.log(PROVIDER_URL)

function App() {
  const [state, setState] = useState({ web3 : null, contract : null});
  const [data, setData] = useState();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider(`${PROVIDER_URL}`); // my Alchemy node provider to Goerli blockchain network
    console.log(provider)

    async function template() {
      const web3 = new Web3(provider);
      //console.log(web3);

      // to interact with our smart contract we require 2 things
      // 1) ABI - in SimpleStorage.json (we imported it)
      // 2) contract address
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      console.log(deployedNetwork.address);


      const contract = new web3.eth.Contract(SimpleStorage.abi, deployedNetwork.address); // create new instance of our Smart Contract

      setState({ web3 : web3, contract : contract});
    }

    provider && template(); // only run template function if you have provider
  },[]);

  console.log(state);

  // read from contract
  useEffect(() => {
    const { contract } = state;

    async function readContract() {
      const data = await contract.methods.getter().call(); // call getter method from your smart contract
      setData(parseInt(data, 10));
      console.log(data)
    }

    contract && readContract(); // only call it when you have contract

  },[state]);

  function changeValue(event) {
    console.log(event.target.value);
    setValue(event.target.value);
  }

  // write to smart contract
  async function writeData() {
    const { contract } = state;

    // Get the account that's making the transaction
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const fromAccount = accounts[0];

    try {
      await contract.methods.setter(value).send({
        from: fromAccount,
      });

      window.location.reload(); // refresh after setting smart contract value

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
    <h1>Welcome to Dapp</h1>
    <div className="App">
      <p className="text">Contract Data : {data}</p>
      <div>
        <input type="number" value={value} onChange={changeValue} id="value" required="required" ></input>
      </div>

      <button onClick={writeData} className="button button2">
        Change Data
      </button>
    </div>
  </>
  )
}

export default App;
