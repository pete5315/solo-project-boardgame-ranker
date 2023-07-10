import React from 'react';
import { Link } from 'react-router-dom';
// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
      <Link pathname="https://www.linkedin.com/in/steven-petersen-5912348/">LinkedIn</Link>

      </div>
    </div>
  );
}

export default AboutPage;
