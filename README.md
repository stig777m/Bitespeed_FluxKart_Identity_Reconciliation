# Bitespeed_FluxKart_Identity_Reconciliation
Identity Reconciliation API for FluxKart by Bitespeed


An API endpoint which will return the primary contact details of a customer when ordering at FluxKart.com.

If a customer contact details that is the Email and Phone Number is given to the "/identify" endpoint, 
it will return all the contacts linked to it, and all the contacts linked to those contacts.

What that essentially means is that no matter how ofter a person changes the Email and PhoneNumber, if it overlaps anywhere this API's logic can get all the related contacts.

To put this in another way if a customer gives -Enters Email A and PhoneNumber B
                                     next time -enters Email A and PhoneNumber C
                                     next time -enters Email D and PhoneNumber C
                                     next time -enters Email D and PhoneNumber E

That means the related contacts of this customer includes Email A,D and PhoneNumber B,C,E
...this case was not mentioned in the questionair, so just wanted to point out that I have included this with the basic cases.