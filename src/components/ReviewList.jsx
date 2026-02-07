import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewList = () => {
    const navigate = useNavigate();
    const [savedWords, setSavedWords] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('reviewList') || '[]');
        setSavedWords(stored);
    }, []);

    const handleDelete = (index) => {
        if (window.confirm('この単語をリストから削除しますか？')) {
            const newSaved = savedWords.filter((_, i) => i !== index);
            setSavedWords(newSaved);
            localStorage.setItem('reviewList', JSON.stringify(newSaved));
        }
    };

    return (
        <div className="review-container">
            <h2>見直しリスト</h2>
            {savedWords.length === 0 ? (
                <p>保存された単語はありません。</p>
            ) : (
                <div className="review-list">
                    {savedWords.map((row, index) => (
                        <div key={index} className="review-row">
                            <div className="review-content">
                                <span className="review-word">{row.word}</span>
                                <span className="review-meaning">{row.meaning}</span>
                                <span className="review-level">({row.level})</span>
                            </div>
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(index)}
                            >
                                削除
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button className="back-button" onClick={() => navigate('/course-select')}>
                コース選択へ戻る
            </button>
        </div>
    );
};

export default ReviewList;
