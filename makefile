# Define paths to backend and frontend directories
FRONTEND_DIR=frontend
BACKEND_DIR=backend

# Default target to run both frontend and backend
all: install start

# Install dependencies for frontend and backend
install:
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install

# Start both frontend and backend concurrently
start:
	@echo "Starting backend server..."
	cd $(BACKEND_DIR) && python3 app.py &
	@echo "Starting frontend server..."
	cd $(FRONTEND_DIR) && npm start

# Stop all running services
stop:
	@echo "Stopping all running processes..."
	kill $$(lsof -t -i:3000) || true
	kill $$(lsof -t -i:5000) || true

# Clean node_modules and Python environment
clean:
	@echo "Cleaning project..."
	cd $(FRONTEND_DIR) && rm -rf node_modules package-lock.json
	cd $(BACKEND_DIR) && find . -type d -name "__pycache__" -exec rm -rf {} +
	@rm -rf backend/uploads

# Format backend code (optional)
format:
	@echo "Formatting backend code with Black..."
	cd $(BACKEND_DIR) && black .

