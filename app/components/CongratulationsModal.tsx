'use client';

import { useState } from 'react';
import Modal from './Modal';
import Confetti from './Confetti';
import { Heart, Award } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CongratulationsModal = ({ isOpen, onClose }: CongratulationsModalProps) => {
  return (
    <>
      {isOpen && <Confetti />}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="modal-content">
          <div className="modal-inner">
            <button onClick={onClose} className="close-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="award-icon">
              <Award size={48} />
            </div>
            
            <h2 className="modal-title">
              Congratulations!
            </h2>
            
            <div className="avatar-container">
              <div className="avatar-wrapper">
                <Image 
                  src="/images/doctor-avatar.jpg"
                  alt="Doctor Avatar"
                  fill
                  className="avatar-image"
                  priority 
                />
              </div>
            </div>
            
            <p className="message-text">
              Congrats on finishing
              <span className="highlight"> second year </span> 
              of medical school!
            </p>
            
            
            
            <p className="message-text">
              Wishing you the absolute best of luck on your board exams and beyond! Your hard work and dedication will definitely pay off.
            </p>
            
            <p className="message-text">
              I know this app wasn't kept up to date with the last few mods and I apologize for that. But..
            </p>
            
            <div className="heart-message">
              {/* <Heart className="heart-icon" fill="#ec4899" /> */}
              <p>I'm happy to have met you and hopefully was helpful to you in some way!</p>
            </div>
            
            <button onClick={onClose} className="close-message-button">
              Close Message
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CongratulationsModal;