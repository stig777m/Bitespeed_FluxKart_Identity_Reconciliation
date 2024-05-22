const { Contact } = require('../models');

exports.identifyContact = async (email, phoneNumber) => {
  const contacts = await Contact.findAll({
    where: {
        [Op.or]: [
          { email: email || null },
          { phoneNumber: phoneNumber || null }
        ]
      }
  });

  const contactRes = await processContact(contacts,email,phoneNumber);

  return contactRes;
};

const processContact = async (contacts,email,phoneNumber) => {

    let relatedContact = [];

    if(contacts.length > 1){

    }

    if(contacts.length === 1){

    }

    if (contacts.length === 0) {
        const newContact = await Contact.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary' 
        });
        relatedContact.push(newContact);
    }

    return returnContact(relatedContact);
};

function returnContact(contacts) {
    const emails = [];
    const phoneNumbers = [];
    const secondaryContactIds = [];
    const primaryContatctId = contacts[0].id;
  
    contacts.forEach((contact, index) => {
      if (contact.email && !emails.includes(contact.email)) {
        emails.push(contact.email);
      }
      if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) {
        phoneNumbers.push(contact.phoneNumber);
      }
      if (index > 0) {
        secondaryContactIds.push(contact.id);
      }
    });
  
    return {
      contact: {
        primaryContatctId,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };
  }
