package repository

import (
	"database/sql"
	"fmt"

	"github.com/yourusername/krissite-backend/internal/models"
)

type LetterRepository struct {
	db *sql.DB
}

func NewLetterRepository(db *sql.DB) *LetterRepository {
	return &LetterRepository{db: db}
}

func (r *LetterRepository) GetAll() ([]models.Letter, error) {
	query := `
		SELECT id, title, text, date, tag, in_progress, created_at, updated_at
		FROM letters
		ORDER BY id DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var letters []models.Letter
	for rows.Next() {
		var letter models.Letter
		err := rows.Scan(
			&letter.ID,
			&letter.Title,
			&letter.Text,
			&letter.Date,
			&letter.Tag,
			&letter.InProgress,
			&letter.CreatedAt,
			&letter.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		letters = append(letters, letter)
	}

	return letters, nil
}

func (r *LetterRepository) GetByID(id int) (*models.Letter, error) {
	query := `
		SELECT id, title, text, date, tag, in_progress, created_at, updated_at
		FROM letters
		WHERE id = $1
	`

	var letter models.Letter
	err := r.db.QueryRow(query, id).Scan(
		&letter.ID,
		&letter.Title,
		&letter.Text,
		&letter.Date,
		&letter.Tag,
		&letter.InProgress,
		&letter.CreatedAt,
		&letter.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("letter not found")
	}
	if err != nil {
		return nil, err
	}

	return &letter, nil
}

func (r *LetterRepository) Create(req models.CreateLetterRequest) (*models.Letter, error) {
	query := `
		INSERT INTO letters (title, text, date, tag, in_progress, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING id, title, text, date, tag, in_progress, created_at, updated_at
	`

	var letter models.Letter
	err := r.db.QueryRow(
		query,
		req.Title,
		req.Text,
		req.Date,
		req.Tag,
		req.InProgress,
	).Scan(
		&letter.ID,
		&letter.Title,
		&letter.Text,
		&letter.Date,
		&letter.Tag,
		&letter.InProgress,
		&letter.CreatedAt,
		&letter.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &letter, nil
}

func (r *LetterRepository) Update(id int, req models.UpdateLetterRequest) (*models.Letter, error) {
	// Получаем текущие данные
	current, err := r.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Обновляем только те поля, которые переданы
	if req.Title != nil {
		current.Title = *req.Title
	}
	if req.Text != nil {
		current.Text = *req.Text
	}
	if req.Date != nil {
		current.Date = *req.Date
	}
	if req.Tag != nil {
		current.Tag = *req.Tag
	}
	if req.InProgress != nil {
		current.InProgress = *req.InProgress
	}

	query := `
		UPDATE letters
		SET title = $1, text = $2, date = $3, tag = $4, in_progress = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING id, title, text, date, tag, in_progress, created_at, updated_at
	`

	var letter models.Letter
	err = r.db.QueryRow(
		query,
		current.Title,
		current.Text,
		current.Date,
		current.Tag,
		current.InProgress,
		id,
	).Scan(
		&letter.ID,
		&letter.Title,
		&letter.Text,
		&letter.Date,
		&letter.Tag,
		&letter.InProgress,
		&letter.CreatedAt,
		&letter.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &letter, nil
}

func (r *LetterRepository) Delete(id int) error {
	query := `DELETE FROM letters WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("letter not found")
	}

	return nil
}
