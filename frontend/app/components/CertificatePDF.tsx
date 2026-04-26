'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 50,
    },
    borderContainer: {
        border: '2px solid #ECCC5F',
        padding: 40,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ECCC5F',
        textAlign: 'center',
        marginBottom: 40,
        letterSpacing: 1,
    },
    awardText: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 20,
    },
    completionText: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 20,
    },
    courseName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ECCC5F',
        textAlign: 'center',
        marginBottom: 40,
    },
    dateContainer: {
        marginTop: 'auto',
        textAlign: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#888888',
        textAlign: 'center',
    },
    footer: {
        marginTop: 20,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 15,
    },
    footerText: {
        fontSize: 10,
        color: '#999999',
        textAlign: 'center',
    },
    signatureLine: {
        width: 200,
        height: 1,
        backgroundColor: '#333',
        marginHorizontal: 'auto',
        marginTop: 40,
        marginBottom: 10,
    },
    signatureText: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
    profesor: {
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 20,
    }
});

interface CertificatePDFProps {
    nombre: string;
    curso: string;
    profesor: string;
    fecha: string;
}

export function CertificatePDF({ nombre, curso, profesor, fecha }: CertificatePDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.borderContainer}>
                    <Text style={styles.title}>Certificado de Finalización</Text>
                    
                    <Text style={styles.awardText}>Se otorga a</Text>
                    
                    <Text style={styles.name}>{nombre}</Text>
                    
                    <Text style={styles.completionText}>por completar con éxito el curso</Text>
                    
                    <Text style={styles.courseName}>{curso}</Text>
                    
                    {profesor && profesor !== 'null' && (
                        <Text style={styles.profesor}>Profesor: {profesor}</Text>
                    )}
                    
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureText}>Firma</Text>
                    
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>Fecha de emisión: {fecha}</Text>
                    </View>
                    
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>F&A cursos - Plataforma de Educación en Línea</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}