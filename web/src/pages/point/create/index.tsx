import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-text-mask";
import cep from "cep-promise";
import * as yup from "yup";
import api from "../../../services/api";

import "./styles.css";

import logoImg from "../../../assets/images/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

yup.setLocale({
  mixed: {
    required: "Preencha o campo",
  },
  string: {
    min: "É necessário ter ${min} caracteres",
  },
});

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required(),
  whatsapp: yup.string().required().min(14),
  state: yup.string().required(),
  city: yup.string().required(),
  cep: yup.string().required().min(9),
  neighborhood: yup.string().required(),
  street: yup.string().required(),
  streetNumber: yup.string().required(),
  items: yup
    .array(yup.number())
    .required()
    .test("items", "Selecione um item acima", (array: Array<Number>) => {
      if (array.length === 0) return false;
      return true;
    }),
});

const CreatePoint = () => {
  const { register, control, handleSubmit, errors, setValue } = useForm({
    mode: "onBlur",
    validationSchema,
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      streetNumber: "",
      items: {},
    },
  });

  const [itemsAvailable, setItemsAvailable] = useState<Item[]>([]);
  const [itemsSelected, setItemsSelected] = useState<number[]>([]);

  const history = useHistory();

  useEffect(() => {
    api.get("items").then((response) => {
      setItemsAvailable(response.data);
    });
    register({ name: "items" });
  }, []);

  useEffect(() => {
    setValue("items", itemsSelected);
  }, [itemsSelected]);

  function whatsappMask(value: String) {
    let numbers = value.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join("").length;
    }

    if (numberLength > 10) {
      return [
        "(",
        /[1-9]/,
        /[1-9]/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
    } else {
      return [
        "(",
        /[1-9]/,
        /[1-9]/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ];
    }
  }

  function handleCep([event]: any) {
    const cepInput = String(event.target.value).replace("-", "");
    cep(cepInput).then((result) => {
      setValue("state", result.state);
      setValue("city", result.city);
      setValue("neighborhood", result.neighborhood);
      setValue("street", result.street);
    });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = itemsSelected.findIndex((e) => e === id);
    if (alreadySelected >= 0) {
      const filteredItems = itemsSelected.filter((e) => e !== id);
      setItemsSelected(filteredItems);
    } else {
      setItemsSelected([...itemsSelected, id]);
    }
  }

  async function onSubmit(data: Object) {
    await api
      .post("points", data)
      .then(() => {
        history.push("/cadastro/sucesso");
      })
      .catch(() =>
        alert("Erro ao realizar o cadastro, tente novamente mais tarde")
      );
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logoImg} alt="Logo Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da empresa:</label>
            <input
              placeholder="Nome da empresa"
              type="text"
              name="name"
              id="name"
              maxLength={64}
              ref={register}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email:</label>
              <input
                placeholder="email@email.com"
                type="email"
                name="email"
                id="email"
                maxLength={254}
                ref={register}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp:</label>
              <Controller
                as={InputMask}
                control={control}
                mask={whatsappMask}
                placeholder="(41)99999-9999"
                type="text"
                name="whatsapp"
                id="whatsapp"
                guide={false}
              />
              {errors.whatsapp && (
                <p className="error-message">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa:</span>
          </legend>
          <div className="field-group">
            <div className="field">
              <label htmlFor="cep">CEP:</label>
              <Controller
                as={InputMask}
                control={control}
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
                placeholder="00000-000"
                type="text"
                name="cep"
                id="cep"
                maxLength={9}
                onBlur={handleCep}
                guide={false}
              />
              {errors.cep && (
                <p className="error-message">{errors.cep.message}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="state">Estado (UF):</label>
              <input
                placeholder="Estado"
                type="text"
                name="state"
                id="state"
                maxLength={254}
                ref={register}
              />
              {errors.state && (
                <p className="error-message">{errors.state.message}</p>
              )}
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="city">Cidade:</label>
              <input
                placeholder="Cidade"
                type="text"
                name="city"
                id="city"
                maxLength={254}
                ref={register}
              />
              {errors.city && (
                <p className="error-message">{errors.city.message}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="neighborhood">Bairro:</label>
              <input
                placeholder="Bairro"
                type="text"
                name="neighborhood"
                id="neighborhood"
                maxLength={254}
                ref={register}
              />
              {errors.neighborhood && (
                <p className="error-message">{errors.neighborhood.message}</p>
              )}
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="street">Rua:</label>
              <input
                placeholder="Rua"
                type="text"
                name="street"
                id="street"
                maxLength={254}
                ref={register}
              />
              {errors.street && (
                <p className="error-message">{errors.street.message}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="streetNumber">Número:</label>
              <input
                placeholder="Número"
                type="text"
                name="streetNumber"
                id="streetNumber"
                maxLength={6}
                ref={register}
              />
              {errors.streetNumber && (
                <p className="error-message">{errors.streetNumber.message}</p>
              )}
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo:</span>
          </legend>
          <ul className="items-grid">
            {itemsAvailable.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={itemsSelected.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
          {errors.items && (
            <p className="error-message">Selecione um item acima</p>
          )}
        </fieldset>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CreatePoint;
