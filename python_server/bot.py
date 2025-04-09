import imaplib
from email.header import decode_header
import re
import quopri
import email
import html2text
from bs4 import BeautifulSoup
import requests
import urllib.parse
import base64

def run_bot(service, email_user):
   try:
       username = email_user
       url = f"https://phmsoft.tech/SpaceentApp/API's/Pruebas.php?comando=Correos&Correo={username}"
       
       response = requests.get(url)
       if response.status_code == 200:
           data = response.json()
           
           if "message" in data or "error" in data:
               return "Error: Credenciales no encontradas"
           
           contrasena = data['Password']
           print (username)
           print (contrasena)
           
           try:
               mail = imaplib.IMAP4_SSL("imap.titan.email", 993)
               
               try:
                   auth_string = f'\x00{username}\x00{contrasena}'.encode('utf-8')
                   mail.authenticate('PLAIN', lambda x: auth_string)
               except Exception:
                   try:
                       mail.login(str(username), str(contrasena))
                   except imaplib.IMAP4.error:
                       return "Error de autenticación. Por favor verifica tus credenciales."

               mail.select("inbox")
               result, data = mail.uid('search', None, "(UNSEEN)")
               mail_ids = data[0].split()

               if not mail_ids:
                   mail.logout()
                   return "No hay correos nuevos para procesar"

               latest_email_id = mail_ids[-1]
               result, email_data = mail.uid('fetch', latest_email_id, '(BODY.PEEK[HEADER])')
               raw_email = email_data[0][1].decode("utf-8")
               
               try:
                   email_message = email.message_from_string(raw_email)
               except Exception:
                   mail.logout()
                   return "Error al procesar el correo"

               subject = decode_header(email_message['Subject'])[0][0]
               if isinstance(subject, bytes):
                   subject = subject.decode()

               keywords = ["disney+", "star+", "amazon"]
               if any(keyword in service.lower() for keyword in keywords):
                   if service.lower() in subject.lower():
                       result, email_data = mail.uid('fetch', latest_email_id, '(BODY.PEEK[TEXT])')
                       raw_email = email_data[0][1].decode("utf-8")
                       try:
                           email_message = email.message_from_string(raw_email)
                       except Exception:
                           mail.logout()
                           return "Error al procesar el contenido del correo"

                       body = ""
                       if email_message.is_multipart():
                           for part in email_message.get_payload():
                               payload = part.get_payload(decode=True)
                               if part.get_content_type() == "text/html":
                                   body = html2text.html2text(payload.decode())
                               else:
                                   try:
                                       decoded_payload = payload.decode("utf-8")
                                   except UnicodeDecodeError:
                                       try:
                                           decoded_payload = payload.decode("iso-8859-1")
                                       except Exception:
                                           decoded_payload = ""

                                   soup = BeautifulSoup(decoded_payload, 'html.parser')
                                   if soup.find():
                                       body = html2text.html2text(decoded_payload)
                                   else:
                                       body = decoded_payload
                       else:
                           payload = email_message.get_payload(decode=True)
                           if email_message.get_content_type() == "text/html":
                               body = html2text.html2text(payload.decode())
                           else:
                               try:
                                   decoded_payload = payload.decode("utf-8")
                               except UnicodeDecodeError:
                                   try:
                                       decoded_payload = payload.decode("iso-8859-1")
                                   except Exception:
                                       decoded_payload = ""
                               
                               soup = BeautifulSoup(decoded_payload, 'html.parser')
                               if soup.find():
                                   body = html2text.html2text(decoded_payload)
                               else:
                                   body = decoded_payload

                       verification_code = re.search(r'\s(\d{6})\s', body, re.MULTILINE)

                       if verification_code:
                           verification_code = verification_code.group()
                           print("Código enviado correctamente")
                           mail.uid('store', latest_email_id, '+FLAGS', '(\\Seen)')
                       else:
                           verification_code = "No se encontró el código de verificación, inténtalo de nuevo en 1 minuto"

                       mail.logout()
                       return verification_code
                   else:
                       mail.logout()
                       return "No se encontró el código de verificación, inténtalo de nuevo en 1 minuto"

               if "Netflix" in service:
                   result, email_data = mail.uid('fetch', latest_email_id, '(BODY.PEEK[TEXT])')
                   raw_email = email_data[0][1].decode("utf-8")
                   email_message = email.message_from_string(raw_email)

                   body = ""
                   if email_message.is_multipart():
                       for part in email_message.get_payload():
                           if part.get_content_type() == "text/plain":
                               body = part.get_payload(decode=True)
                           elif part.get_content_type() == "text/html":
                               body = html2text.html2text(part.get_payload(decode=True).decode())
                   else:
                       body = email_message.get_payload(decode=True)
                   
                   if isinstance(body, bytes):
                       body = body.decode()

                   if "Código Estoy de Viaje" in service:
                       verification_code = re.search(r'https:\/\/www\.netflix\.com\/account\/travel\/verify\?nftoken=[^"]*', body, re.DOTALL)
                   elif "Inicio de Sesión" in service:
                       verification_code = re.search(r'\b(\d{4})\b', body)
                   elif "Actualizar Hogar" in service:
                       verification_code = re.search(r'https:\/\/www\.netflix\.com\/account\/update-primary-location\?nftoken=[^"]*', body, re.DOTALL)
                   else:
                       verification_code = None

                   if verification_code:
                       if "Inicio de Sesión" in service:
                           verification_code = verification_code.group()
                       else:
                           verification_code = verification_code.group()
                           verification_code = quopri.decodestring(verification_code).decode()
                           verification_code = re.search(r'https:\/\/www\.netflix\.com\/[^\s]+', verification_code).group()
                       print("Código enviado correctamente")
                       mail.uid('store', latest_email_id, '+FLAGS', '(\\Seen)')
                   else:
                       verification_code = "No se encontró el código de verificación, inténtalo de nuevo en 1 minuto"

                   mail.logout()
                   return verification_code

           except Exception:
               return "Error de conexión"
               
       else:
           return f"Error: La API respondió con código {response.status_code}"
           
   except Exception:
       return "Error general en el proceso"