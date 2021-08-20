import React, { useState } from "react";

function Navbar() {
  const [busquedas, setBusquedas] = useState({
    name: "",
  });

  const setAccount = (event) => {
    setBusquedas({ ...busquedas, [event.target.name]: event.target.value });
  };

  const buscar = () => {
    console.log(busquedas);
    fetch("http://localhost:3003/coins", {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      method: "GET",
      body: JSON.stringify(busquedas),
    })
      .then((response) => response.json())
      .then((hola) => {
        console.log("GUARDADO", hola);
        setBusquedas({
          name: "",
        });
      });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                name="name"
                value={busquedas.name}
                onChange={setAccount}
              />
              <button
                className="btn btn-outline-success"
                type="button"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
