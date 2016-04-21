FROM onsdigital/flask-crypto-queue

ADD settings.py /app/settings.py
ADD server.py /app/server.py
ADD static /app/static
ADD templates /app/templates

# set working directory to /app/
WORKDIR /app/

RUN mkdir /app/static/images

EXPOSE 5000

ENTRYPOINT python3 server.py