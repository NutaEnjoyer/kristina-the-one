package models

import "time"

type Letter struct {
	ID         int       `json:"id" db:"id"`
	Title      string    `json:"title" db:"title"`
	Text       string    `json:"text" db:"text"`
	Date       string    `json:"date" db:"date"`
	Tag        string    `json:"tag" db:"tag"`
	InProgress bool      `json:"inProgress" db:"in_progress"`
	CreatedAt  time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt  time.Time `json:"updatedAt" db:"updated_at"`
}

type CreateLetterRequest struct {
	Title      string `json:"title" binding:"required"`
	Text       string `json:"text" binding:"required"`
	Date       string `json:"date"`
	Tag        string `json:"tag"`
	InProgress bool   `json:"inProgress"`
}

type UpdateLetterRequest struct {
	Title      *string `json:"title"`
	Text       *string `json:"text"`
	Date       *string `json:"date"`
	Tag        *string `json:"tag"`
	InProgress *bool   `json:"inProgress"`
}
