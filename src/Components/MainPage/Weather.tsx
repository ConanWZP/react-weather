import axios from 'axios';
import React, {FormEvent, useState} from 'react';
import styles from './styles.module.scss'


const Weather = () => {

    const [inputValue, setInputValue] = useState('')
    const [weather, setWeather] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    let today = new Date()

    let date = today.getDate() + '-' +  Number(today.getMonth() +1) + '-' + today.getFullYear()


    const iconURL = "http://openweathermap.org/img/w/";

    const getData = async () => {
        setError(false)
        setWeather({})
        if (inputValue === '') {
            setErrorMessage(`Input can't be empty`)
            setError(true)
        } else {
            setIsLoading(true)
            await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=6ce1de9956916dae295ea4472e3a350e`)
                .then((data) => {
                    setWeather(data.data)
                    console.log(data.data)
                    setErrorMessage('')
                    setError(false)
                }).catch((reason) => {

                    console.log(reason.response.data.message)
                    setErrorMessage(reason.response.data.message)
                    setError(true)
                }).finally(() => {
                    setInputValue('')
                    setIsLoading(false)
                })
        }


    }

    const getDataByEnter = async (e: FormEvent) => {
        e.preventDefault()
        await getData()
    }

    const getDataByClick = async () => {
        await getData()

    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1>Weather now</h1>
                <span>{date}</span>
                <form onSubmit={getDataByEnter} className={styles.input}>
                    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                           placeholder={'Введите название города...'}/>

                    <svg onClick={getDataByClick} className={styles.button} xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24"
                         strokeWidth="1.5"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                    </svg>


                </form>
                {error ?
                    <div className={styles.error}>{errorMessage}</div>
                    :
                    (
                        weather?.name ?
                            <div className={styles.info}>
                                <h2>{weather?.name}, {weather?.sys.country}</h2>
                                <div className={styles.icon}>
                                    <img src={iconURL + weather.weather[0].icon + '.png'}
                                         alt={weather.weather[0].main}/>
                                </div>
                                <p>Temp: {Math.round(weather.main.temp - 273)}°C</p>
                                <p>Weather: {weather.weather[0].main}</p>
                                <p>Temp Range: {Math.round(weather.main.temp_min - 273)}°C
                                    / {Math.round(weather.main.temp_max - 273)}°C</p>
                            </div>
                            : null
                    )

                }
                {isLoading ? <div>Загрузка</div> : null}

            </div>
        </div>
    );
};

export default Weather;