package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/yourusername/krissite-backend/internal/config"
	"github.com/yourusername/krissite-backend/internal/handlers"
	"github.com/yourusername/krissite-backend/internal/repository"
	"github.com/yourusername/krissite-backend/internal/service"
)

func main() {
	// Загружаем конфигурацию
	cfg := config.Load()

	// Подключаемся к БД
	db, err := sql.Open("postgres", cfg.GetDBConnectionString())
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Проверяем соединение
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Connected to database successfully")

	// Инициализируем слои
	letterRepo := repository.NewLetterRepository(db)
	letterService := service.NewLetterService(letterRepo)
	letterHandler := handlers.NewLetterHandler(letterService)

	// Настраиваем роутер
	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/letters", letterHandler.GetAllLetters).Methods("GET")
	api.HandleFunc("/letters/{id}", letterHandler.GetLetterByID).Methods("GET")
	api.HandleFunc("/letters", letterHandler.CreateLetter).Methods("POST")
	api.HandleFunc("/letters/{id}", letterHandler.UpdateLetter).Methods("PUT")
	api.HandleFunc("/letters/{id}", letterHandler.DeleteLetter).Methods("DELETE")

	// Настраиваем CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "https://yourdomain.com"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	// Запускаем сервер
	log.Printf("Server starting on port %s...", cfg.ServerPort)
	if err := http.ListenAndServe(":"+cfg.ServerPort, handler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
