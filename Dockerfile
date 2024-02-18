# Define a imagem base
FROM node:18

# Install tzdata package
RUN apt-get update && apt-get install -y tzdata

# Set the timezone
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY . .

# Instala as dependências
RUN npm install

RUN npm install pm2 -g

# Expõe a porta em que o site será executado (geralmente é a porta 8080)
EXPOSE 8080

# Inicia o servidor
CMD [ "pm2-runtime", "npm", "--", "run", "prod" ]