FROM ubuntu:latest

WORKDIR /
COPY Agrippa-0.5.Linux /Agrippa-0.5.Linux/

EXPOSE 3000
CMD [ "/Agrippa-0.5.Linux/agrippad", "/Agrippa-0.5.Linux/" ]
