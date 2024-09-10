import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
    faHiking, faWalking, faBinoculars, faLandmark, faBicycle, faWater, faParachuteBox, faSkiing, faSnowboarding,
    faMountain, faFish, faSpa, faWineGlass, faBeer, faMusic, faFireAlt, faRunning, faFlagCheckered,
    faCampground, faHorse, faCamera, faSeedling, faGuitar, faBookOpen, faShoppingBag, faUtensils, faPrayingHands,
    faOm, faChurch, faStar, faMountainSun, faPersonSkiingNordic, faSwimmer, faSleigh, faAnchor, faTree, faHeart, faHandsHelping
} from '@fortawesome/free-solid-svg-icons';
import '../styles/FilterBar.css';

const FilterBar = ({ onFilter }) => {
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const scrollContainerRef = useRef(null);

    const activityTypeIcons = {
        Hiking: faHiking,
        Trekking: faWalking,
        Safari: faBinoculars,
        'Cultural Tour': faLandmark,
        Cycling: faBicycle,
        Kayaking: faWater,
        Skydiving: faParachuteBox,
        Skiing: faSkiing,
        Snowboarding: faSnowboarding,
        Surfing: faWater,
        'Scuba Diving': faSwimmer,
        Snorkeling: faWater,
        'Rock Climbing': faMountain,
        Mountaineering: faMountain,
        Rafting: faWater,
        'Bungee Jumping': faParachuteBox,
        Paragliding: faParachuteBox,
        Camping: faCampground,
        Fishing: faFish,
        'Horseback Riding': faHorse,
        'Wildlife Safari': faBinoculars,
        Photography: faCamera,
        Yoga: faSpa,
        Meditation: faOm,
        'Spa & Wellness': faSpa,
        Cooking: faUtensils,
        'Wine Tasting': faWineGlass,
        'Beer Tasting': faBeer,
        'Music Festival': faMusic,
        Carnival: faFireAlt,
        Marathon: faRunning,
        Triathlon: faFlagCheckered,
        'Cultural Festival': faGuitar,
        'Historical Tour': faLandmark,
        'Educational Tour': faBookOpen,
        Volunteering: faHandsHelping,
        Sightseeing: faBinoculars,
        Shopping: faShoppingBag,
        Nightlife: faMusic,
        'Food Tour': faUtensils,
        'Wine Tour': faWineGlass,
        'Beer Tour': faBeer,
        'Spiritual Tour': faPrayingHands,
        'Religious Tour': faChurch,
        'Adventure Sports': faMountain,
        'Extreme Sports': faMountainSun,
        'Water Sports': faSwimmer,
        'Winter Sports': faPersonSkiingNordic,
        'Summer Sports': faTree,
        'Spring Sports': faSeedling,
        'Fall Sports': faTree,
        'Autumn Sports': faTree,
        'Multi-Sport': faMountainSun,
        Other: faStar,
    };

    const handleFilterClick = (activityType) => {
        setSelectedFilter(activityType);
        onFilter(activityType);
    };

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(container.scrollWidth > container.clientWidth + container.scrollLeft);
        const items = Array.from(container.children);
        const firstVisibleIndex = Math.floor(container.scrollLeft / items[0].offsetWidth);
        const lastVisibleIndex = Math.ceil((container.scrollLeft + container.clientWidth) / items[0].offsetWidth);
        items.forEach((item, index) => {
            if (index < firstVisibleIndex || index > lastVisibleIndex) {
                item.classList.add('blurred');
            } else {
                item.classList.remove('blurred');
            }
        });
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        container.addEventListener('scroll', checkScroll);
        checkScroll(); // Initial check
        return () => container.removeEventListener('scroll', checkScroll);
    }, []);

    return (
        <div className="filter-bar-wrapper">
            {showLeftArrow && (
                <button className="scroll-button left" onClick={scrollLeft}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
            )}
            <div className="filter-bar" ref={scrollContainerRef}>
                {Object.keys(activityTypeIcons).map((activityType) => (
                    <div key={activityType} className="filter-button-container">
                        <button
                            className={`filter-button ${selectedFilter === activityType ? 'active' : ''}`}
                            onClick={() => handleFilterClick(activityType)}
                        >
                            <FontAwesomeIcon icon={activityTypeIcons[activityType]} />
                            <span>{activityType}</span>
                        </button>
                    </div>
                ))}
            </div>
            {showRightArrow && (
                <button className="scroll-button right" onClick={scrollRight}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            )}
        </div>
    );
};

export default FilterBar;
