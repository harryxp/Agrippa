FROM ubuntu:latest

WORKDIR /
COPY Agrippa-0.4.Linux /Agrippa-0.4.Linux/

EXPOSE 3000
CMD [ "/Agrippa-0.4.Linux/agrippad", "/Agrippa-0.4.Linux/" ]
