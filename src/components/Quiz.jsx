import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const Quiz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const level = location.state?.level || 'elementary';

    const [allWords, setAllWords] = useState([]);
    const [displayedWords, setDisplayedWords] = useState([]);
    const [startId, setStartId] = useState('');
    const [endId, setEndId] = useState('');
    const [minId, setMinId] = useState(null);
    const [maxId, setMaxId] = useState(null);
    const [isTestFinished, setIsTestFinished] = useState(false);
    const [savedWords, setSavedWords] = useState([]);

    useEffect(() => {
        Papa.parse('/tango.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const filtered = results.data.filter((row) => row.level === level && row.id);
                setAllWords(filtered);

                if (filtered.length > 0) {
                    const ids = filtered.map(row => parseInt(row.id, 10)).filter(id => !isNaN(id));
                    if (ids.length > 0) {
                        const min = Math.min(...ids);
                        const max = Math.max(...ids);
                        setMinId(min);
                        setMaxId(max);
                        // Default range: first 10 words or all if less than 10
                        setStartId(min);
                        setEndId(Math.min(min + 9, max));
                    }
                }

                // Load saved words from localStorage
                const stored = JSON.parse(localStorage.getItem('reviewList') || '[]');
                setSavedWords(stored);
            },
        });
    }, [level]);

    const handleStart = () => {
        const s = parseInt(startId, 10);
        const e = parseInt(endId, 10);

        if (isNaN(s) || isNaN(e)) {
            alert('開始番号と終了番号を数値で入力してください');
            return;
        }

        const filtered = allWords.filter((row) => {
            const id = parseInt(row.id, 10);
            return id >= s && id <= e;
        });
        setDisplayedWords(filtered);
        setIsTestFinished(false);
    };

    const handleFinish = () => {
        if (window.confirm('答えを表示しますか？')) {
            setIsTestFinished(true);
        }
    };

    const handleSave = (word) => {
        const newSaved = [...savedWords, word];
        setSavedWords(newSaved);
        localStorage.setItem('reviewList', JSON.stringify(newSaved));
        alert(`"${word.word}" を見直しリストに保存しました`);
    };

    const today = new Date().toLocaleDateString();

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="range-inputs">
                    {minId !== null && (
                        <div className="range-info">
                            有効範囲: {minId} ～ {maxId}
                        </div>
                    )}
                    <div>
                        <label>Start: <input type="number" value={startId} onChange={(e) => setStartId(e.target.value)} /></label>
                        <label>End: <input type="number" value={endId} onChange={(e) => setEndId(e.target.value)} /></label>
                        <button onClick={handleStart}>表示</button>
                    </div>
                </div>
                <div className="header-right">
                    <div className="date">{today}</div>
                    <button onClick={handleFinish} className="finish-button">終了</button>
                </div>
            </div>

            <div className="word-list">
                {displayedWords.length === 0 && allWords.length > 0 && (
                    <p>範囲を指定して「表示」ボタンを押してください。</p>
                )}
                {displayedWords.map((row, index) => (
                    <div key={index} className="word-row">
                        <span className="word-id">{row.id}</span>
                        <span className="word-text">{row.word}</span>
                        <span className={`word-meaning ${isTestFinished ? 'revealed' : 'hidden'}`}>
                            {row.meaning}
                        </span>
                        {isTestFinished && (
                            <button className="save-button" onClick={() => handleSave(row)}>保存</button>
                        )}
                    </div>
                ))}
            </div>

            <button className="back-to-top" onClick={() => navigate('/')}>最初に戻る</button>
        </div>
    );
};

export default Quiz;
