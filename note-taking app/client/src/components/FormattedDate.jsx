import React from 'react';

const FormattedDate = ({ timestamp }) => {
  const creationDate = new Date(timestamp);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedCreationDate = creationDate.toLocaleString('en-US', options);

  return <span>{formattedCreationDate}</span>;
};

export default FormattedDate;
