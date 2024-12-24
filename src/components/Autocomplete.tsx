import React, { useState, useEffect, useRef } from 'react';
import champions from '../data/champions.json';

interface Champion {
    "champion": string,
    "name": string,
    "gender": string,
    "position": string[],
    "species": string[],
    "resource": string[],
    "range_type": string[],
    "region": string[],
    "release_year": string[],
}

function hasIntersection(arr1: string[], arr2: string[]): boolean {
    return arr1.some((item) => arr2.includes(item));
}

function areArraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((item, index) => item === arr2[index]);
}

const Autocomplete = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions] = useState<Champion[]>(champions);
    const [filteredSuggestions, setFilteredSuggestions] = useState<Champion[]>([]);
    const [showingSuggestions, setShowingSuggestions] = useState<boolean>(false);
    const [selectedChampions, setSelectedChampions] = useState<Champion[]>([]);
    const [selectedChampion, setSelectedChampion] = useState<Champion>(champions[137]);
    const [playable, setPlayable] = useState<boolean>(true);

    const inputRef = useRef<HTMLInputElement>(null);

    console.log(selectedChampion)

    // Фильтрация подсказок
    useEffect(() => {
        const selectedChampionsNames = selectedChampions.map(champion => champion.name);
        const filtered = suggestions.filter((champion) =>
            champion.name.toLowerCase().startsWith(inputValue.toLowerCase()) &&
            !selectedChampionsNames.includes(champion.name)
        );
        setFilteredSuggestions(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, suggestions]);

    const handleSelectChampion = (champion: Champion) => {
        // Добавляем чемпиона в список выбранных, если его там еще нет
        if (!selectedChampions.some((selected) => selected.name === champion.name)) {
            setSelectedChampions((prev) => [...prev, champion]);
        }
        setInputValue('');
        setShowingSuggestions(false);
        if (champion.name === selectedChampion.name) {
            setPlayable(false);
        }
        inputRef.current?.focus();
    };

    return (
        <div style={{ position: 'relative', margin: '0 auto' }}>
            <div style={{width: '100%', marginBottom: 20}}>
                <button
                    style={{
                        width: 200,
                        height: 50,
                        background: 'gold',
                        border: 'none',
                        fontSize: 22,
                        fontWeight: 700
                    }}
                    onClick={() => {
                        setSelectedChampion(champions[Math.floor(Math.random() * champions.length)])
                        setFilteredSuggestions([]);
                        setInputValue('');
                        setPlayable(true);
                        setSelectedChampions([]);
                        setShowingSuggestions(false);
                    }}
                >
                        New game
                </button>
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder="Guess champion..."
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowingSuggestions(true);
                }}
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '300px'
                }}
                disabled={!playable}
            />
            {inputValue && filteredSuggestions.length > 0 && showingSuggestions && (
                <ul
                    style={{
                        position: 'absolute',
                        width: 320,
                        top: '110px',
                        left: 0,
                        right: 0,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        zIndex: 1000,
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        maxHeight: 180,
                        overflowY: 'auto',
                    }}
                >
                    {filteredSuggestions.map((champion, index) => (
                        <li
                            key={index}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'row',
                                width: 320,
                                textAlign: 'center',
                                alignItems: 'center'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelectChampion(champion);
                            }}
                        >
                            <div style={{height: 32, width: 32, marginRight: 5}}>
                                <img
                                    src={champion.champion}
                                    alt={''}
                                    height={32}
                                    width={32}
                                />
                            </div>{champion.name}
                        </li>
                    ))}
                </ul>
            )}
            <div style={{ marginTop: '20px' }}>
                <h3>You tried champions:</h3>
                <ul
                    style={{
                        listStyle: 'none',
                        padding: 0,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                        width: 'fit-content',
                    }}
                >
                    {[...selectedChampions].reverse().map((champion, index) => (
                        <li
                            key={index}
                            style={{
                                padding: '10px',
                                borderBottom: index !== selectedChampions.length - 1 ? '1px solid #ddd' : 'none',
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    outline: '2px solid grey',
                                }}
                            >
                                <img
                                    src={champion.champion}
                                    alt={''}
                                    height={80}
                                    width={80}
                                />
                            </div>
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: champion.gender === selectedChampion.gender ? 'green' : 'darkred',
                                    color: 'white',
                                    outline: '2px solid grey',
                                }}
                            >
                                {champion.gender}
                            </div>
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: areArraysEqual(champion.position, selectedChampion.position) ? 'green' : hasIntersection(champion.position, selectedChampion.position) ? 'gold' : 'darkred',
                                    color: 'white',
                                    outline: '2px solid grey',
                                }}
                            >
                                {champion.position.join(', ')}
                            </div>
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: areArraysEqual(champion.species, selectedChampion.species) ? 'green' : hasIntersection(champion.species, selectedChampion.species) ? 'gold' : 'darkred',
                                    color: 'white',
                                    outline: '2px solid grey',
                                }}
                            >
                                {champion.species.join(', ')}
                            </div>
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: areArraysEqual(champion.resource, selectedChampion.resource) ? 'green' : hasIntersection(champion.resource, selectedChampion.resource) ? 'gold' : 'darkred',
                                    color: 'white',
                                    outline: '2px solid grey',
                                }}
                            >
                                {champion.resource.join(', ')}
                            </div>
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: areArraysEqual(champion.range_type, selectedChampion.range_type) ? 'green' : hasIntersection(champion.range_type, selectedChampion.range_type) ? 'gold' : 'darkred',
                                    color: 'white',
                                    outline: '2px solid grey',
                                }}
                            >
                                {champion.range_type.join(', ')}
                            </div>
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: areArraysEqual(champion.region, selectedChampion.region) ? 'green' : hasIntersection(champion.region, selectedChampion.region) ? 'gold' : 'darkred',
                                    color: 'white',
                                    outline: '2px solid grey',
                                }}
                            >
                                {champion.region.join(', ')}
                            </div>
                            <div
                                style={{
                                    height: 80,
                                    width: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: champion.release_year === selectedChampion.release_year ? 'green': 'darkred',
                                    color: 'white',
                                    outline: '2px solid grey',
                                }}
                            >
                                {champion.release_year.join(', ')}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Autocomplete;
