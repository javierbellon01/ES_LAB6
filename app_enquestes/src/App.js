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

  const canviarPregunta = (index, nouText) => {
    const novesPreguntes = [...preguntes];
    novesPreguntes[index].text = nouText;
    setPreguntes(novesPreguntes);
  };

  const afegirOpcio = (pIndex) => {
    const novesPreguntes = [...preguntes];
    novesPreguntes[pIndex].opcio.push("");
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
        <div key={i}>
          <input 
            placeholder={`Pregunta ${i + 1}`}
            value={preg.text}
            onChange={e => canviarPregunta(i, e.target.value)}
          />
          {preg.opcions.map((opc, j) => (
            <input key={j} placeholder={`Opció ${j + 1}`} />
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
