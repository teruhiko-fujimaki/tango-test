import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseSelect = () => {
    const navigate = useNavigate();

    const handleSelect = (level) => {
        navigate('/quiz', { state: { level } });
    };

    return (
        <div className="course-select-container">
            <h2>コース選択</h2>
            <div className="course-buttons">
                <button onClick={() => handleSelect('elementary')}>小学生単語</button>
                <button onClick={() => handleSelect('junior_high')}>中学生単語</button>
            </div>
        </div>
    );
};

export default CourseSelect;
