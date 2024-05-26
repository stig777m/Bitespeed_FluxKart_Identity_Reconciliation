const { Contact } = require('../models');
const { Op } = require('sequelize');

//enum for LinkPrecedence
const LINK_PRECEDENCE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
};

exports.identifyContact = async (email, phoneNumber) => {
  try{
    
    //list to store related contacts
    const contacts = [];

    //getting all the directly realted contacts
    const contactsInDb = await Contact.findAll({
      where: {
          [Op.or]: [
            { email: email || null },
            { phoneNumber: phoneNumber || null }
          ]
        }
    });

    //checking if there are primaryContacts in the directly related contacts
    if(contactsInDb.some(contact => contact.linkPrecedence === LINK_PRECEDENCE.PRIMARY) == false){

      //if there are no primaryContacts in the directly related contacts, then get the primarycontacts ids from the linkedId of the secondaryContavct
      const ids = [...new Set(contactsInDb
        .filter(contact => contact.linkPrecedence === LINK_PRECEDENCE.SECONDARY)
        .map(contact => contact.linkedId)
      )];

      //further get the primaryContacts and secondaryContacts
      const primaryOfexistingSec = await Contact.findAll({
        where: {
          [Op.or]:[
            { id: { [Op.in]: ids } },
            { linkedId: { [Op.in]: ids } }
          ]
        }
      });
      contacts.push(...primaryOfexistingSec);
    }
    else{

      contacts.push(...contactsInDb);
      //if there are primaryContacts in the directly related contacts, then get the primaryContacts ids from id
      const ids = [...new Set(contactsInDb
        .filter(contact => contact.linkPrecedence === LINK_PRECEDENCE.PRIMARY)
        .map(contact => contact.id)
      )];

      //further get the secondaryContacts
      const primaryOfexistingSec = await Contact.findAll({
        where: {
            linkedId: { [Op.in]: ids }
        }
      });
      contacts.push(...primaryOfexistingSec);
    }
    const contactRes = await processContact(contacts,email,phoneNumber);

    return contactRes;
  }
  catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
  
};

//function to handle all the cases of related contacts
const processContact = async (contacts,email,phoneNumber) => {
    try{
      let relatedContact = [];

      relatedContact.push(...contacts);

      //when there are multiple related contacts
      if(contacts.length > 1){

        //getting the number of primary contacts existing
        const primaryContactList = contacts.filter(contact => contact.linkPrecedence === LINK_PRECEDENCE.PRIMARY);
        let primaryContact = primaryContactList[0];

        //if there are more than one primary contacts existing, make the oldest "primary" and rest "secondary" and link them
        if(primaryContactList.length > 1) {
          primaryContactList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          primaryContact = primaryContactList[0];

          if (primaryContact) {

            // Update linkPrecedence of rest of the contacts to "secondary" in the database
            const restContacts = primaryContactList.slice(1); // Get all contacts except the oldest one
            await Contact.update({ linkPrecedence: LINK_PRECEDENCE.SECONDARY ,linkedId: primaryContact.id }, {
              where: {
                id: restContacts.map(contact => contact.id) // Update all contacts in restContacts
              }
            });
            relatedContact = [];
            relatedContact.push(primaryContact);
            relatedContact.push(...restContacts); // replacing the updated contact in the list
          } 
          else {
            console.log('Contact list is empty.');
          }
        }
        else {
          const lnkedId = primaryContact.id;
          if(email != null && phoneNumber != null){
            const secContact = await Contact.create({
                email,
                phoneNumber,
                linkPrecedence: LINK_PRECEDENCE.SECONDARY,
                linkedId: lnkedId
            });
            relatedContact.push(secContact);
          }
        }
      }

      //when there is one existing record, make existing "primary" and new contact as "secondary" and link them
      if(contacts.length === 1){
          if(contacts[0].linkPrecedence == LINK_PRECEDENCE.SECONDARY){
            const updatedContact = await Contact.update(
              { linkPrecedence: LINK_PRECEDENCE.PRIMARY, linkedId: null},
              { where: { id: contacts[0].id } }
            );
            relatedContact = [];
            relatedContact.push(updatedContact); // replacing the updated contact in the list
          }
          let lnkedId = contacts[0].id;
          if(email != null && phoneNumber != null){
            const secContact = await Contact.create({
              email,
              phoneNumber,
              linkPrecedence: LINK_PRECEDENCE.SECONDARY,
              linkedId: lnkedId
            });
            relatedContact.push(secContact);
          }
          
      }

      //when there are no existing related contacts
      if (contacts.length === 0) {
          const newContact = await Contact.create({
              email,
              phoneNumber,
              linkPrecedence: LINK_PRECEDENCE.PRIMARY 
          });
          relatedContact.push(newContact);
      }

      return returnContact(relatedContact);
    }
    catch (error) {
      console.error('Error fetching contacts:', error); 
      throw error; 
    }
};

function returnContact(contacts) {
    try{
      contacts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const emails = [];
      const phoneNumbers = [];
      const secondaryContactIds = [];
      const primaryContatctId = contacts.find(contact => contact.linkPrecedence === LINK_PRECEDENCE.PRIMARY)?.id || null;
    
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
    catch (error){
      console.error('Error fetching contacts:', error); 
      throw error; 
    }
  }
