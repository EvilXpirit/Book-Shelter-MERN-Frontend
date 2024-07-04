import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactsInfo = () => {
  const [contacts, setContact] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/contact');
        setContact(response.data);
        console.log('Fetched contacts:', response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContact();
  }, []);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(contacts.length / contactsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 mt-10 py-24">
      <h1 className="text-3xl text-white text-center font-bold mb-4">Contact Infos</h1>
      <table className="min-w-full bg-white/75 border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.map(contact => (
            <tr key={contact._id}>
              <td className="border border-gray-300 px-4 py-2">{contact.name}</td>
              <td className="border border-gray-300 px-4 py-2">{contact.email}</td>
              <td className="border border-gray-300 px-4 py-2">{contact.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mx-1 px-3 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContactsInfo;
