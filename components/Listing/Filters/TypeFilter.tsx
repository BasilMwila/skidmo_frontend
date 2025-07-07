import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Chip } from "react-native-paper";
import { propertiesAPI } from "@/services/propertiesApi"; // Adjust the import path

interface TypeFilterProps {
    selectedType: string;
    onSelectType: (type: string) => void;
}

const TypeFilter = ({ selectedType, onSelectType }: TypeFilterProps) => {
    const [propertyTypes, setPropertyTypes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const types = await propertiesAPI.getPropertyTypes();
                setPropertyTypes(types); // Set the fetched property types
            } catch (error) {
                console.error("Failed to fetch property types:", error);
            }
        };

        fetchPropertyTypes();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Type</Text>
            <View style={styles.chipContainer}>
                {Object.entries(propertyTypes).map(([key, value]) => (
                    <Chip
                        key={key}
                        selected={selectedType === key}
                        onPress={() => onSelectType(key)}
                        style={[styles.chip, selectedType === key && styles.selectedChip]}
                        textStyle={selectedType === key ? styles.selectedChipText : styles.chipText}
                    >
                        {value}
                    </Chip>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
    },
    selectedChip: {
        backgroundColor: "#e8f5e9",
        borderColor: "#4CAF50",
        borderWidth: 1,
    },
    chipText: {
        color: "#333",
    },
    selectedChipText: {
        color: "#4CAF50",
    },
});

export default TypeFilter;