FROM node:latest

RUN apt-get update && apt-get install -y \
  libvulkan1 \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev libgif-dev \
  librsvg2-dev pkg-config \
  inetutils-ping \
  net-tools \
  gconf-service \
  libgbm-dev \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  libappindicator1 \
  libnss3 \
  lsb-release \
  xdg-utils \
  bash \
  && rm -rf /var/lib/apt/lists/*


ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=18.17.1

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$NVM_DIR/bin:$PATH

RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION

RUN apt-get install -y wget

RUN rm -rf /app/.wwebjs_auth/session*/
RUN rm -rf /app/.wwebjs_auth/session/

RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

RUN rm ./google-chrome-stable_current_amd64.deb

#RUN npm install

EXPOSE 3000

CMD ["/bin/bash"]

