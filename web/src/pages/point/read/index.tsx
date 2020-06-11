import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
} from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import api from "../../../services/api";

import "./styles.css";

import GoogleMap from "../../../components/googleMaps";

import logoImg from "../../../assets/images/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface UF {
  id: number;
  sigla: string;
}

interface City {
  id: number;
  nome: string;
}

const CreatePoint = () => {
  const [mapOptions, setMapOptions] = useState({
    center: {
      lat: -25.4295963,
      lng: -49.2712724,
    },
    zoom: 14,
  });

  const [mapLocation, setMapLocation] = useState([
    {
      coords: { lat: -25.4295963, lng: -49.2712724 }, // required: latitude & longitude at which to display the marker
      title: `Life, the Universe and Everything`, // optional
      url: `https://wikipedia.org/wiki/Life,_the_Universe_and_Everything`, // optional
    },
  ]);

  const googleMapElement = useMemo(
    () => (
      <GoogleMap
        options={mapOptions}
        onMount="addPins"
        onMountProps={mapLocation}
      />
    ),
    [mapOptions, mapLocation]
  );
  const Map = useCallback(() => googleMapElement, [mapOptions, mapLocation]);
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<UF[]>([]);
  const [selectedUf, setSelectedUf] = useState<UF | null>();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setMapOptions({ center: { lat: latitude, lng: longitude }, zoom: 14 });
      console.log(mapOptions);
    });
  }, []);

  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<UF[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const uf: UF[] = [];
        response.data.forEach((currentValue) => {
          uf.push({ id: currentValue.id, sigla: currentValue.sigla });
        });

        setUfs(uf);
      });
  }, []);

  useEffect(() => {
    if (selectedUf!) {
      axios
        .get<City[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${
            selectedUf!.id
          }/municipios?orderBy=nome`
        )
        .then((response) => {
          const cities: City[] = [];
          response.data.forEach((currentValue) =>
            cities.push({ id: currentValue.id, nome: currentValue.nome })
          );
          setCities(cities);
        });
    } else {
      return;
    }
  }, [selectedUf]);

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const ufId = Number(event.target.value);
    const selectUf: UF = ufs.filter((e: UF) => {
      if (e.id === ufId) return e;
    })[0];
    setSelectedUf(selectUf);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const cityId = Number(event.target.value);
    const selectCity: City = cities.filter((e: City) => {
      if (e.id === cityId) return e;
    })[0];
    setSelectedCity(selectCity);
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

      <form>
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
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email:</label>
              <input
                placeholder="email@email.com"
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp:</label>
              <input
                placeholder="(41) 99999-9999"
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa:</span>
          </legend>
          <div className="field">{Map()}</div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF):</label>
              <select name="uf" id="uf" onChange={handleSelectedUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.sigla}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade:</label>
              <select name="city" id="city" onChange={handleSelectedCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="cep">CEP:</label>
              <input placeholder="00000-000" type="text" name="cep" id="cep" />
            </div>
            <div className="field">
              <label htmlFor="bairro">Bairro:</label>
              <input
                placeholder="Bairro"
                type="text"
                name="bairro"
                id="bairro"
              />
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="rua">Rua:</label>
              <input placeholder="Rua" type="text" name="rua" id="rua" />
            </div>
            <div className="field">
              <label htmlFor="rua-numero">Número:</label>
              <input
                placeholder="Número"
                type="text"
                name="rua-numero"
                id="rua-numero"
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo:</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CreatePoint;
