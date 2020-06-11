import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import "./styles.css";

const CreateSucess = () => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => history.push("/"), 3000);
  }, []);

  return (
    <div className="sucess">
      <div className="sucess-center">
        <FiCheckCircle className="sucess-icon" size="64" />
        <h1>Cadastro realizado com sucesso.</h1>
      </div>
    </div>
  );
};

export default CreateSucess;
