export const enumStatus = {
    Completed: 0,
    Reading: 1,
    Planned: 2,
    Abandoned: 3
}

const statusTranslations: { [key in keyof typeof enumStatus]: string } = {
    Completed: "Прочитано",
    Reading: "Читаю",
    Planned: "В планах",
    Abandoned: "Заброшено",
};

export enum enumGenres {
    NoGenre = 'Без жанра',
    ScienceFiction = 'Научная фантастика',
    Fantasy = 'Фэнтези',
    Novel = 'Роман',
    Philosophy = 'Философия',
    Programming = 'Программирование'
}

export enum enumSaveGenres {
    NoGenre = '',
    ScienceFiction = 'Science Fiction',
    Fantasy = 'Fantasy',
    Novel = 'Novel',
    Philosophy = 'Philosophy',
    Programming = 'Software Development'
}

export const getStatusTranslation = (status: string | undefined): string => {
    if (status && status in statusTranslations) {
        return statusTranslations[status as keyof typeof enumStatus];
    }
    return "Отсутствует";
};