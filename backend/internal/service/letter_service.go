package service

import (
	"github.com/yourusername/krissite-backend/internal/models"
	"github.com/yourusername/krissite-backend/internal/repository"
)

type LetterService struct {
	repo *repository.LetterRepository
}

func NewLetterService(repo *repository.LetterRepository) *LetterService {
	return &LetterService{repo: repo}
}

func (s *LetterService) GetAllLetters() ([]models.Letter, error) {
	return s.repo.GetAll()
}

func (s *LetterService) GetLetterByID(id int) (*models.Letter, error) {
	return s.repo.GetByID(id)
}

func (s *LetterService) CreateLetter(req models.CreateLetterRequest) (*models.Letter, error) {
	return s.repo.Create(req)
}

func (s *LetterService) UpdateLetter(id int, req models.UpdateLetterRequest) (*models.Letter, error) {
	return s.repo.Update(id, req)
}

func (s *LetterService) DeleteLetter(id int) error {
	return s.repo.Delete(id)
}
