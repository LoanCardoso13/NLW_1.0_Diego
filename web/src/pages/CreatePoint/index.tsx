import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg'

interface Item {
    id: number;
    title: string;
    image_url: string;
};

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data); 
        })
    },[]);

    function handleSelectedState(event: ChangeEvent<HTMLSelectElement>) {
        const state = event.target.value;

        setSelectedState(state);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value });
    }

    function handleSelectedItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id) + 1;

        if (alreadySelected > 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const state = selectedState;
        const city = selectedCity;
        const [latitude, longitude] = [-19.8731291, -44.0294353];
        const items = selectedItems;

        const data = new FormData();

            data.append('name', name);
            data.append('email', email);
            data.append('whatsapp', whatsapp);
            data.append('state', state);
            data.append('city', city);
            data.append('latitude', String(latitude));
            data.append('longitude', String(longitude));
            data.append('items', items.join(','));
            
            if (selectedFile) {
                data.append('image', selectedFile); 
            }

        await api.post('points', data);

        alert('ponto de coleta criado!');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecol"/>

                <Link to="/">
                    <FiArrowLeft />
                    Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Register <br/> collection point</h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Your info</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Entity</label>
                        <input 
                            type="text"
                            name="name"
                            id="name" 
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email" 
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp" 
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Address</h2>
                        <span>Select address in the map</span>
                    </legend>

                    <MapContainer 
                        center={[-19.8731291, -44.0294353]} 
                        zoom={15} 
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[-19.8731291, -44.0294353]}>
                            <Popup>
                              A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>

                <div className="field-group">
                    <input type="hidden" name="country" id="countryId" value="CA"/>
                    <div className="field">
                        <label htmlFor="state">State</label>
                        <select 
                            name="state" 
                            className="states order-alpha" 
                            id="stateId"
                            required
                            onChange={handleSelectedState}
                            value={selectedState}
                        >
                            <option value="">Select State</option>
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">City</label>
                        <select 
                            name="city" 
                            className="cities order-alpha" 
                            id="cityId"
                            required
                            onChange={handleSelectedCity}
                            value={selectedCity}
                        >
                            <option value="">Select City</option>
                        </select>
                    </div>
                </div>


                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Collecting items</h2>
                        <span>Select the collected items below</span>
                    </legend>

                    <ul className='items-grid'>
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected': ''}    
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                        
                    </ul>
                </fieldset>
                <button type="submit">Register collection point</button>
            </form>
        </div>
    )
};

export default CreatePoint;