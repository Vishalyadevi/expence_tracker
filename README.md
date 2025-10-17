# expence_tracker


Sure! Here’s a step-by-step guide to **create and configure an AWS EC2 instance** to host your **Dockerized React application**:

---

## Step 1: Prepare Your Dockerized React Application

Make sure you have a Dockerfile in your React project directory. Example Dockerfile for React:

```Dockerfile
# Use Node.js image to build the React app
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use Nginx to serve the build files
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## Step 2: Create an AWS EC2 Instance

1. **Login to AWS Console**
   Go to [https://aws.amazon.com](https://aws.amazon.com) and log in.

2. **Navigate to EC2 Dashboard**
   Services > Compute > EC2.

3. **Launch Instance**

   * Click **Launch Instance**.
   * Choose an Amazon Machine Image (AMI): Select **Amazon Linux 2 AMI** or **Ubuntu Server 22.04 LTS**.
   * Choose Instance Type: t2.micro (eligible for free tier) or larger as needed.
   * Configure Instance: Accept defaults.
   * Add Storage: Default is fine.
   * Add Tags (optional).
   * Configure Security Group:

     * Add rules to allow:

       * **HTTP (port 80)** inbound from anywhere (0.0.0.0/0).
       * **SSH (port 22)** inbound from your IP address only.
   * Review and Launch.

4. **Create or Select Key Pair**
   Create a new key pair or use an existing one to SSH into your instance. Download `.pem` file safely.

5. **Launch Instance**.

---

## Step 3: Connect to Your EC2 Instance

* Open terminal (or PowerShell on Windows).
* Navigate to the directory with your `.pem` key file.
* Run (replace `your-key.pem` and `ec2-user@<ec2-public-ip>` accordingly):

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@<ec2-public-ip>
```

> For Ubuntu AMI, username is `ubuntu` instead of `ec2-user`.

---

## Step 4: Install Docker on EC2

For **Amazon Linux 2:**

```bash
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

Then **log out and back in** or:

```bash
newgrp docker
```

Check Docker:

```bash
docker --version
```

---

## Step 5: Transfer Your Dockerized React App to EC2

Two options:

### Option 1: Push to Docker Hub and Pull on EC2

* Build and tag your image locally:

```bash
docker build -t your-dockerhub-username/react-app .
docker push your-dockerhub-username/react-app
```

* SSH into EC2 and pull image:

```bash
docker pull your-dockerhub-username/react-app
```

### Option 2: Transfer files via SCP and build on EC2

From local machine:

```bash
scp -i your-key.pem -r /path/to/your/react-app ec2-user@<ec2-public-ip>:/home/ec2-user/
```

Then on EC2:

```bash
cd react-app
docker build -t react-app .
```

---

## Step 6: Run the Docker Container on EC2

```bash
docker run -d -p 80:80 react-app
```

* `-d` runs container in detached mode.
* `-p 80:80` maps EC2 port 80 to container port 80.

---

## Step 7: Access Your React App

* Open your browser.
* Navigate to `http://<ec2-public-ip>/`.
* You should see your React application running.

---

## Optional: Keep Your Container Running After Reboot

* Use Docker restart policies:

```bash
docker run -d --restart unless-stopped -p 80:80 react-app
```

* Or use `docker-compose` with systemd or other process managers.

---

## Summary

| Step | Action                                  |
| ---- | --------------------------------------- |
| 1    | Dockerize your React app                |
| 2    | Create EC2 instance with security group |
| 3    | SSH into EC2                            |
| 4    | Install Docker                          |
| 5    | Transfer or pull your Docker image      |
| 6    | Run Docker container on port 80         |
| 7    | Access app via browser                  |

---

If you want, I can help you with exact commands for your OS or automating this with scripts! Would you like that?
