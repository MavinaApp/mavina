-- Users tablosu
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'USER',
    Phone NVARCHAR(20),
    Address NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Appointments tablosu
CREATE TABLE Appointments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId INT NOT NULL,
    WasherId INT NOT NULL,
    AppointmentDate DATETIME2 NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    ServiceName NVARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Address NVARCHAR(255) NOT NULL,
    Latitude DECIMAL(10,8),
    Longitude DECIMAL(11,8),
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CustomerId) REFERENCES Users(Id),
    FOREIGN KEY (WasherId) REFERENCES Users(Id)
);

-- Transactions tablosu
CREATE TABLE Transactions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AppointmentId INT NOT NULL,
    CustomerId INT NOT NULL,
    WasherId INT NOT NULL,
    ServiceStatus NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    PaymentStatus NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    Amount DECIMAL(10,2) NOT NULL,
    ServiceName NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (AppointmentId) REFERENCES Appointments(Id),
    FOREIGN KEY (CustomerId) REFERENCES Users(Id),
    FOREIGN KEY (WasherId) REFERENCES Users(Id)
);

-- İndeksler
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Appointments_CustomerId ON Appointments(CustomerId);
CREATE INDEX IX_Appointments_WasherId ON Appointments(WasherId);
CREATE INDEX IX_Appointments_Status ON Appointments(Status);
CREATE INDEX IX_Transactions_AppointmentId ON Transactions(AppointmentId);
CREATE INDEX IX_Transactions_CustomerId ON Transactions(CustomerId);
CREATE INDEX IX_Transactions_WasherId ON Transactions(WasherId);
CREATE INDEX IX_Transactions_ServiceStatus ON Transactions(ServiceStatus);
CREATE INDEX IX_Transactions_PaymentStatus ON Transactions(PaymentStatus); 