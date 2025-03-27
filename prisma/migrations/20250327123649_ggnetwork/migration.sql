-- CreateTable
CREATE TABLE "Utilisateur" (
    "ID_Utilisateur" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,
    "Pseudo" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Birth_Date" INTEGER NOT NULL,
    "Num_Tel" INTEGER NOT NULL,
    "Verif_ID" BOOLEAN,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("ID_Utilisateur")
);

-- CreateTable
CREATE TABLE "Profil" (
    "ID_Profil" SERIAL NOT NULL,
    "Description" TEXT NOT NULL,
    "Img" TEXT,
    "ID_Utilisateur" INTEGER NOT NULL,
    "ID_Connexion" TEXT,
    "Profil_Privacy" BOOLEAN NOT NULL,
    "Statut" TEXT NOT NULL,
    "Img_Banner" TEXT,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("ID_Profil")
);

-- CreateTable
CREATE TABLE "Badge" (
    "ID_Badge" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Img" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("ID_Badge")
);

-- CreateTable
CREATE TABLE "ProfilBadge" (
    "ID_Profil" INTEGER NOT NULL,
    "ID_Badge" INTEGER NOT NULL,

    CONSTRAINT "ProfilBadge_pkey" PRIMARY KEY ("ID_Profil","ID_Badge")
);

-- CreateTable
CREATE TABLE "Message" (
    "ID_Mess" SERIAL NOT NULL,
    "ID_Expediteur" INTEGER NOT NULL,
    "Content" TEXT NOT NULL,
    "Date_Envoi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("ID_Mess")
);

-- CreateTable
CREATE TABLE "Destinataire" (
    "ID_Mess" INTEGER NOT NULL,
    "ID_Utilisateur" INTEGER NOT NULL,
    "Statut" TEXT NOT NULL,

    CONSTRAINT "Destinataire_pkey" PRIMARY KEY ("ID_Mess","ID_Utilisateur")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "ID_Conv" SERIAL NOT NULL,
    "Nom" TEXT,
    "Date_Creation" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("ID_Conv")
);

-- CreateTable
CREATE TABLE "ParticipantConversation" (
    "ID_Conv" INTEGER NOT NULL,
    "ID_Utilisateur" INTEGER NOT NULL,

    CONSTRAINT "ParticipantConversation_pkey" PRIMARY KEY ("ID_Conv","ID_Utilisateur")
);

-- CreateTable
CREATE TABLE "MessageConversation" (
    "ID_Mess" INTEGER NOT NULL,
    "ID_Conv" INTEGER NOT NULL,

    CONSTRAINT "MessageConversation_pkey" PRIMARY KEY ("ID_Mess","ID_Conv")
);

-- CreateTable
CREATE TABLE "Publication" (
    "ID_Post" SERIAL NOT NULL,
    "Contenu" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "ID_Utilisateur" INTEGER NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("ID_Post")
);

-- CreateTable
CREATE TABLE "Commentaire" (
    "ID_Com" SERIAL NOT NULL,
    "Contenu" TEXT NOT NULL,
    "ID_Utilisateur" INTEGER NOT NULL,
    "ID_Post" INTEGER NOT NULL,

    CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("ID_Com")
);

-- CreateTable
CREATE TABLE "PublicationLikes" (
    "ID_Post" INTEGER NOT NULL,
    "ID_Utilisateur" INTEGER NOT NULL,

    CONSTRAINT "PublicationLikes_pkey" PRIMARY KEY ("ID_Post","ID_Utilisateur")
);

-- CreateTable
CREATE TABLE "CommentaireLikes" (
    "ID_Com" INTEGER NOT NULL,
    "ID_Utilisateur" INTEGER NOT NULL,

    CONSTRAINT "CommentaireLikes_pkey" PRIMARY KEY ("ID_Com","ID_Utilisateur")
);

-- CreateTable
CREATE TABLE "Groupe" (
    "ID_Group" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Groupe_pkey" PRIMARY KEY ("ID_Group")
);

-- CreateTable
CREATE TABLE "UserGroupe" (
    "ID_Utilisateur" INTEGER NOT NULL,
    "ID_Group" INTEGER NOT NULL,

    CONSTRAINT "UserGroupe_pkey" PRIMARY KEY ("ID_Utilisateur","ID_Group")
);

-- CreateTable
CREATE TABLE "Concours" (
    "ID_Concours" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,
    "DateDebut" TIMESTAMP(3) NOT NULL,
    "DateFin" TIMESTAMP(3) NOT NULL,
    "ID_Group" INTEGER NOT NULL,
    "ID_Modo" INTEGER NOT NULL,

    CONSTRAINT "Concours_pkey" PRIMARY KEY ("ID_Concours")
);

-- CreateTable
CREATE TABLE "ConcoursUtilisateur" (
    "ID_Utilisateur" INTEGER NOT NULL,
    "ID_Concours" INTEGER NOT NULL,

    CONSTRAINT "ConcoursUtilisateur_pkey" PRIMARY KEY ("ID_Concours","ID_Utilisateur")
);

-- CreateTable
CREATE TABLE "Moderateur" (
    "ID_Modo" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,
    "Email" TEXT NOT NULL,

    CONSTRAINT "Moderateur_pkey" PRIMARY KEY ("ID_Modo")
);

-- CreateTable
CREATE TABLE "Abonnement" (
    "ID_Utilisateur" INTEGER NOT NULL,
    "ID_Profil" INTEGER NOT NULL,

    CONSTRAINT "Abonnement_pkey" PRIMARY KEY ("ID_Utilisateur","ID_Profil")
);

-- CreateTable
CREATE TABLE "Notation" (
    "ID_Produit" INTEGER NOT NULL,
    "ID_Utilisateur" INTEGER NOT NULL,
    "Note" INTEGER NOT NULL,

    CONSTRAINT "Notation_pkey" PRIMARY KEY ("ID_Produit","ID_Utilisateur")
);

-- CreateTable
CREATE TABLE "Produit" (
    "ID_Produit" SERIAL NOT NULL,
    "Nom" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Prix" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("ID_Produit")
);

-- CreateTable
CREATE TABLE "MarketPlace" (
    "ID_MarketPlace" SERIAL NOT NULL,
    "ID_Produit" INTEGER NOT NULL,
    "ID_Modo" INTEGER NOT NULL,
    "ID_Group" INTEGER NOT NULL,

    CONSTRAINT "MarketPlace_pkey" PRIMARY KEY ("ID_MarketPlace")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_Email_key" ON "Utilisateur"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Profil_ID_Utilisateur_key" ON "Profil"("ID_Utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "Moderateur_Email_key" ON "Moderateur"("Email");

-- AddForeignKey
ALTER TABLE "Profil" ADD CONSTRAINT "Profil_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilBadge" ADD CONSTRAINT "ProfilBadge_ID_Profil_fkey" FOREIGN KEY ("ID_Profil") REFERENCES "Profil"("ID_Profil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilBadge" ADD CONSTRAINT "ProfilBadge_ID_Badge_fkey" FOREIGN KEY ("ID_Badge") REFERENCES "Badge"("ID_Badge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ID_Expediteur_fkey" FOREIGN KEY ("ID_Expediteur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinataire" ADD CONSTRAINT "Destinataire_ID_Mess_fkey" FOREIGN KEY ("ID_Mess") REFERENCES "Message"("ID_Mess") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinataire" ADD CONSTRAINT "Destinataire_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantConversation" ADD CONSTRAINT "ParticipantConversation_ID_Conv_fkey" FOREIGN KEY ("ID_Conv") REFERENCES "Conversation"("ID_Conv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantConversation" ADD CONSTRAINT "ParticipantConversation_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageConversation" ADD CONSTRAINT "MessageConversation_ID_Mess_fkey" FOREIGN KEY ("ID_Mess") REFERENCES "Message"("ID_Mess") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageConversation" ADD CONSTRAINT "MessageConversation_ID_Conv_fkey" FOREIGN KEY ("ID_Conv") REFERENCES "Conversation"("ID_Conv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_ID_Post_fkey" FOREIGN KEY ("ID_Post") REFERENCES "Publication"("ID_Post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationLikes" ADD CONSTRAINT "PublicationLikes_ID_Post_fkey" FOREIGN KEY ("ID_Post") REFERENCES "Publication"("ID_Post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationLikes" ADD CONSTRAINT "PublicationLikes_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireLikes" ADD CONSTRAINT "CommentaireLikes_ID_Com_fkey" FOREIGN KEY ("ID_Com") REFERENCES "Commentaire"("ID_Com") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireLikes" ADD CONSTRAINT "CommentaireLikes_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupe" ADD CONSTRAINT "UserGroupe_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupe" ADD CONSTRAINT "UserGroupe_ID_Group_fkey" FOREIGN KEY ("ID_Group") REFERENCES "Groupe"("ID_Group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concours" ADD CONSTRAINT "Concours_ID_Group_fkey" FOREIGN KEY ("ID_Group") REFERENCES "Groupe"("ID_Group") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concours" ADD CONSTRAINT "Concours_ID_Modo_fkey" FOREIGN KEY ("ID_Modo") REFERENCES "Moderateur"("ID_Modo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcoursUtilisateur" ADD CONSTRAINT "ConcoursUtilisateur_ID_Concours_fkey" FOREIGN KEY ("ID_Concours") REFERENCES "Concours"("ID_Concours") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConcoursUtilisateur" ADD CONSTRAINT "ConcoursUtilisateur_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_ID_Profil_fkey" FOREIGN KEY ("ID_Profil") REFERENCES "Profil"("ID_Profil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notation" ADD CONSTRAINT "Notation_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notation" ADD CONSTRAINT "Notation_ID_Produit_fkey" FOREIGN KEY ("ID_Produit") REFERENCES "Produit"("ID_Produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlace" ADD CONSTRAINT "MarketPlace_ID_Produit_fkey" FOREIGN KEY ("ID_Produit") REFERENCES "Produit"("ID_Produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlace" ADD CONSTRAINT "MarketPlace_ID_Modo_fkey" FOREIGN KEY ("ID_Modo") REFERENCES "Moderateur"("ID_Modo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlace" ADD CONSTRAINT "MarketPlace_ID_Group_fkey" FOREIGN KEY ("ID_Group") REFERENCES "Groupe"("ID_Group") ON DELETE RESTRICT ON UPDATE CASCADE;
