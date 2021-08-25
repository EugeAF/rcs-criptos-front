import React, { useState, useEffect } from "react";
import "../Coins/Coins.css";

function Coins() {
    const [data, setDatas] = useState([]);
    const [fetchFlag, setFetchFlag] = useState('');
    const [index, setIndex] = useState(null);
    const [err, setErr] = useState('');

    /*READ*/
    useEffect(() => {
        fetch('http://localhost:3003/coins/list')
            .then(response => response.json())
            .then(hola => {
                console.log('FETCH ', hola)
                setDatas(hola)
            });
    }, [fetchFlag]);

    const [coins, setCoins] = useState({
        name: '',
        value: '',
        rateUSD: '',
        notas: ''
    });

    /*CREATE*/
    /*Setea */
    const setAccount = (event) => {
        setCoins({ ...coins, [event.target.name]: event.target.value });
    };

    const add = () => {
        if (coins.name === "" || coins.value === "" || coins.rateUSD === "" || isNaN(coins.value) || isNaN(coins.value)){
            alert("Complete todos los campos");
            return;
        }
        fetch('http://localhost:3003/coins', {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(coins)
        })
        .then(response => response.json())
        .then(hola => {
            console.log("GUARDADO", hola)
            setDatas([...data, hola]);
            setCoins({
                name: '',
                value: '',
                rateUSD: '',
                notas: ''
            });
        })
    };


    /*DELETE*/
    const eliminar = (index) => {
        fetch(`http://localhost:3003/coins/${data[index]._id}`, {
            method: 'DELETE',
            body: JSON.stringify(null)
        })
            .then(response => setFetchFlag(response.json()))
            .then(chau => console.log("CHAU  ", chau));
    };

    /*EDITAR*/
    const editar = (index) => {
        fetch(`http://localhost:3003/coins/${data[index]._id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(coins)
        })
            .then(response => setFetchFlag(response.json()))
            .then(hola => {
                console.log("GUARDADO", hola)
                setCoins({
                    name: '',
                    value: '',
                    rateUSD: '',
                    notas: ''
                });
            })
    };

    const [bitcoin, setBitcoin] = useState({});

    let intentos = 0;

    const actualizar = (index) => {
        const name = data[index].name.toLowerCase();
        fetch(`https://api.coincap.io/v2/assets/${name}`)
            .then(response => {
                console.log("RESPONSE ", response);
                if(response.status == 404){
                    setErr(`${name} no se encuentra`);
                }else{
                    return response.json()
                }
            })
            .then(hola => {
                setBitcoin(hola);
                intentos = 0;
            })
            .then(setIndex(index))
            .catch((error) => {
                console.log("PRIMER ERROR", error);
                actualizar(index);
                intentos++;
                console.log("Intentos ", intentos);
                if(intentos >= 5){
                    intentos = 0;
                    alert('Algo salio mal. Por favor vuelva a intentarlo.');
                }
            });
    };


    useEffect(() => {
        console.log("anda", index)
        if(index != null){
            fetch(`http://localhost:3003/coins/bitcoin/${data[index]._id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(bitcoin)
        })
            .then(response => {
                setFetchFlag(response.json())
            });
        }

    }, [bitcoin])

    return (
        <div className="container mt-4">
            <div className="row">
                <form className="d-flex flex-column align-items-center form-contact justify-content-center">

                    <label htmlFor="" >Name</label>
                    <input type="text" name="name" className="w-50" value={coins.name} onChange={setAccount} />

                    <label htmlFor="" >Value</label>
                    <input type="text" name="value" className="w-50" value={coins.value} onChange={setAccount} />

                    <label htmlFor="" >Rate USD</label>
                    <input type="text" name="rateUSD" className="w-50" value={coins.rateUSD} onChange={setAccount} />

                    <label htmlFor="" >Notas</label>
                    <input type="text" name="notas" className="w-50" value={coins.notas} onChange={setAccount} />

                    <a className="btn btn-primary w-25 mt-3 mb-5" onClick={add}>Add</a>
                </form>
            </div>
            {err && <h2>{err}</h2>}
            <div className="row justify-content-center align-items-center">
                {data.length ? data.map((item, index) => (
                    <div key={index} className="col-sm-12 col-md-6 col-lg-4 mt-3 align-items-center align-items-center">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">Nombre: {item.name}</h5>
                                <p className="card-text">Value: {parseFloat(item.value).toFixed(2)}</p>
                                <p className="card-text">RateUSD: $ {parseFloat(item.rateUSD).toFixed(2)}</p>
                                <p className="card-text">Notas: {item.notas}</p>
                                <button className="btn btn-danger ms-3" onClick={() => eliminar(index)}>Eliminar</button>
                                <button className="btn btn-secondary" onClick={() => editar(index)}>Editar</button>
                                <button className="btn btn-secondary" onClick={() => actualizar(index)}>Actualizar</button>
                            </div>
                            <div className="card-footer text-muted">
                                {item.createdAt}
                            </div>
                        </div>
                    </div>
                )) : 
                    <div>
                        <h2>Usted no tiene ninguna cripto aun</h2>
                    </div>
                }
            </div>
        </div>
    )
}
export default Coins;