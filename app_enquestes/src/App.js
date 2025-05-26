import React, { useState } from "react";

function App() {
  const [enquestes, setEnquestes] = useState([]);
  const [titol, setTitol] = useState("");
  const [preguntes, setPreguntes] = useState([
    { text: "", opcions: ["", ""] }
  ]);

  const afegirPregunta = () => {
    setPreguntes([...preguntes, { text: "", opcions: ["", ""] }]);
  };

  const eliminarPregunta = (index) => {
    setPreguntes(preguntes.filter((_, i) => i !== index));
  };

  const canviarPregunta = (index, nouText) => {
    const novesPreguntes = [...preguntes];
    novesPreguntes[index].text = nouText;
    setPreguntes(novesPreguntes);
  };

  const afegirOpcio = (pIndex) => {
    const novesPreguntes = [...preguntes];
    novesPreguntes[pIndex].opcions.push("");
    setPreguntes(novesPreguntes);
  };

  const eliminarOpcio = (pIndex, oIndex) => {
    const novesPreguntes = [...preguntes];
    novesPreguntes[pIndex].opcions = novesPreguntes[pIndex].opcions.filter(
      (_, i) => i !== oIndex
    );
    setPreguntes(novesPreguntes);
  };

  const canviarOpcio = (pIndex, oIndex, nouText) => {
    const novesPreguntes = [...preguntes];
    novesPreguntes[pIndex].opcions[oIndex] = nouText;
    setPreguntes(novesPreguntes);
  };

  const guardarEnquesta = () => {
    setEnquestes([...enquestes, { titol, preguntes }]);
    setTitol("");
    setPreguntes([{ text: "", opcions: ["", ""] }]);
  };

  return (
    <div>
      <h1>Crear Enquesta</h1>
      <input
        placeholder="Títol de l'enquesta"
        value={titol}
        onChange={e => setTitol(e.target.value)}
      />
      {preguntes.map((preg, i) => (
        <div key={i} style={{ marginBottom: 20, border: "1px solid gray", padding: 10 }}>
          <input
            placeholder={`Pregunta ${i + 1}`}
            value={preg.text}
            onChange={e => canviarPregunta(i, e.target.value)}
          />
          <button onClick={() => eliminarPregunta(i)} style={{ marginLeft: 10 }}>
            Eliminar pregunta
          </button>

          {preg.opcions.map((opc, j) => (
            <div key={j} style={{ display: "flex", alignItems: "center" }}>
              <input
                placeholder={`Opció ${j + 1}`}
                value={opc}
                onChange={e => canviarOpcio(i, j, e.target.value)}
              />
              <button onClick={() => eliminarOpcio(i, j)} style={{ marginLeft: 5 }}>
                Eliminar opció
              </button>
            </div>
          ))}
          <button onClick={() => afegirOpcio(i)}>Afegir opció</button>
        </div>
      ))}
      <button onClick={afegirPregunta}>Afegir pregunta</button>
      <button onClick={guardarEnquesta}>Guardar enquesta</button>

      <h2>Enquestes guardades</h2>
      {enquestes.map((enq, i) => (
        <div key={i}>
          <h3>{enq.titol}</h3>
          {enq.preguntes.map((p, j) => (
            <p key={j}>{p.text}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;