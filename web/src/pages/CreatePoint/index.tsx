import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg'

interface Item {
    id: number;
    title: string;
    image_url: string;
};

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data); 
        })
    },[]);

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecol"/>

                <Link to="/">
                    <FiArrowLeft />
                    Home
                </Link>
            </header>

            <form>
                <h1>Register <br/> collection point</h1>

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
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email" 
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp" 
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Address</h2>
                        <span>Select address in the map</span>
                    </legend>

                    <MapContainer center={[-19.8731291, -44.0294353]} zoom={15} scrollWheelZoom={false}>
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
                            <li key={item.id}>
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